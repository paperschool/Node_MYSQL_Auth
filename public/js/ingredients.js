var ge = (function () {

  // module methods
  var methods = {};

  // storing currently selected ingredient method
  var activeIngredient = null;

  // simple enum for validation types for consistency sake
  var ValidationTypes = {
    INT            : 0,
    FLOAT          : 1,
    POSITIVE_INT   : 2,
    POSITIVE_FLOAT : 3,
    ALPHANUMERIC   : 4
  }

  // object to store onclick and item relevant details
  function scrollItemIngredient(id,name,colour){

    this.id = id;

    this.name = name;

    this.colour = colour;

    this.active = false;

    this.closeIcon = $('<div class="icon scroll-panel-item-close"></div>')
      .on('click',(()=>{

        methods.deleteIngredient(this.id)
        methods.clearIngredientForm();

      }).bind(this));

    this.dom = $('<a>'+this.name+'</a>')
      .append(this.closeIcon)
      .addClass('scroll-panel-item')
      .on('click',( () => {
        methods.itemClicked( this );
      }).bind(this));

    return this.dom;

  }

  // this method is ran whenever an item is clicked on
  methods.itemClicked = (callingItem) => {

    // blocking gram input as this is locked in to the scale
    $('#ingredient_grams').attr( 'disabled', true );

    // setting form title to default
    $('.ingredient-form-title').text('Ingredient');

    // checking if active ingredient exists and is not the same instance
    // as this caller
    if(activeIngredient && activeIngredient != callingItem){
      // unsetting the active class
      activeIngredient.dom.removeClass('scroll-panel-item-active')
      // setting that objects activity to false
      callingItem.active = false
    }

    // setting active item to self
    activeIngredient = callingItem;

    // checking whether this item is currently selected therefore not
    // worth another post request as already loaded
    if(!callingItem.active){
      // fetching an ingredients details from a given id
      methods.fetchIngredient(callingItem.id)
      // asserting current activity to true
      callingItem.active = true;
    }

    // adding item active class to item
    callingItem.dom.addClass('scroll-panel-item-active')

  }

  // initial ingredient fetch
  methods.fetchAllIngredients = () => {

    $.ajax({
      url    : "/dash/ingredients/fetchALL",
      method : "POST"
    }).done( (ingredients) => {

      $('.dash-content-scroll-panel').empty();

      if(ingredients)
        for(var ingredient of ingredients){

          $('.dash-content-scroll-panel').append(
            new scrollItemIngredient(ingredient.id,ingredient.name,null)
          );

        }

    }).fail( () => {
      // alert("Ingredient Doesnt Exist");
    })

  }

  // fetch an ingredients details given an ingredient id
  methods.fetchIngredient = (id) => {

    $.ajax({
      url    : "/dash/ingredients/fetchONE",
      method : "POST",
      data   : { id : id }
    }).done( (ingredient) => {
      methods.fillIngredientForm(ingredient)
      methods.validateForm();
    }).fail( () => {
      console.log("Ingredient Fetch Error");
    })

  }

  // fill out the ingredient form given a details object
  methods.fillIngredientForm = (ingredient) => {
    $('#ingredient_name').val(ingredient.name);
    $('#ingredient_grams').val(1);
    $('#ingredient_calories').val(ingredient.calories);
    $('#ingredient_fats').val(ingredient.fat);
    $('#ingredient_carbohydrates').val(ingredient.carbohydrates);
    $('#ingredient_proteins').val(ingredient.protein);
    $('#ingredient_sodium').val(ingredient.sodium);
  }

  // clear the ingredient form
  methods.clearIngredientForm = () => {
    $("#ingredient-form")[0].reset();
  }

  // fetch all ingredient details
  methods.scrapeIngredientForm = () => {

    var ingredient = {
      name          : $('#ingredient_name').val(),
      calories      : $('#ingredient_calories').val(),
      fat           : $('#ingredient_fats').val(),
      carbohydrates : $('#ingredient_carbohydrates').val(),
      protein       : $('#ingredient_proteins').val(),
      sodium        : $('#ingredient_sodium').val(),
    };

    return ingredient

  }

  // save new ingredient
  methods.saveIngredient = () => {

    // checking form is valid
    if(!methods.validateForm()){
      alert("Fix Errors!")
      return;
    }

    // applying normalisation calculation to ingredients
    let ingredients = methods.normaliseGrams(
      methods.scrapeIngredientForm()
    );

    $.ajax({
      url         : "/dash/ingredients/createIngredient",
      method      : "POST",
      data        :  JSON.stringify( { ingredient : ingredients } ),
      contentType : "application/json"
    }).done( () => {
      // clearing ingredient form fields
      methods.clearIngredientForm()
      // fetching new set of ingredients
      methods.fetchAllIngredients()
      activeIngredient = null;
    }).fail( () => {
      console.log("Error Creating Ingredient");
    })

  }

  // update existing ingredient given id
  methods.updateIngredient = (id) => {

    if(!methods.validateForm()){
      alert("Fix Errors!")
      return;
    }

    let ingredient = methods.scrapeIngredientForm()

    ingredient['id'] = id || activeIngredient.id;

    $.ajax({
      url         : "/dash/ingredients/updateIngredient",
      method      : "POST",
      data        :  JSON.stringify( { ingredient : ingredient } ),
      contentType : "application/json"
    }).done( () => {
      methods.fetchAllIngredients()
    }).fail( () => {
      console.log("Error Updating Ingredient");
    })

  }

  // delete an existing ingredient given id
  methods.deleteIngredient = (id) => {

    $.ajax({
      url    : "/dash/ingredients/deleteIngredient",
      method : "POST",
      data   : { id : id }
    }).done( () => {
      methods.fetchAllIngredients()
      activeIngredient = null;
    }).fail( () => {
      console.log("Error Deleting Ingredient");
    })

  }

  // method that will clear any existing styling on inputs
  methods.clearValidationStyling = (input) => {
    input.removeClass('text-input-good')
    input.removeClass('text-input-bad')
    input.removeClass('text-input-warning')
  }

  // this method takes the current grams and reduces the other values
  // to one grams worth of the given grams
  methods.normaliseGrams = (ingredient) => {

    let grams = parseFloat($('#ingredient_grams').val());

    ingredient.calories /= grams || 0;
    ingredient.fat /= grams || 0;
    ingredient.carbohydrates /= grams || 0;
    ingredient.protein /= grams || 0;
    ingredient.sodium /= grams || 0;

    return ingredient;

  }

  // method to validate all input forms
  methods.validateForm = () => {

    // used for further checking on submission
    let success = true;

    // fetching jquery objects for all input fields
    let name          = $('#ingredient_name');
    let grams         = $('#ingredient_grams');
    let calories      = $('#ingredient_calories');
    let fat           = $('#ingredient_fats');
    let carbohydrates = $('#ingredient_carbohydrates');
    let protein       = $('#ingredient_proteins');
    let sodium        = $('#ingredient_sodium');

    // clearing all input fields of validation styling
    methods.clearValidationStyling(name)
    methods.clearValidationStyling(grams)
    methods.clearValidationStyling(calories)
    methods.clearValidationStyling(fat)
    methods.clearValidationStyling(carbohydrates)
    methods.clearValidationStyling(protein)
    methods.clearValidationStyling(sodium)

    // TEST ALL INPUTS GIVEN VARIOUS VALIDATIONS
    if(methods.validation([ ValidationTypes.ALPHANUMERIC ],name.val())){
      name.addClass('text-input-good');
    } else {
      success = false;
      name.addClass('text-input-bad');
    }

    if(methods.validation([ ValidationTypes.POSITIVE_FLOAT ],grams.val())){
      grams.addClass('text-input-good');
    } else {
      success = false;
      grams.addClass('text-input-bad');
    }

    if(methods.validation([ ValidationTypes.POSITIVE_INT ],calories.val())){
      calories.addClass('text-input-good');
    } else {
      success = false;
      calories.addClass('text-input-bad');
    }

    if(methods.validation([ ValidationTypes.POSITIVE_FLOAT ],fat.val())){
      fat.addClass('text-input-good');
    } else {
      success = false;
      fat.addClass('text-input-bad');
    }

    if(methods.validation([ ValidationTypes.POSITIVE_FLOAT ],carbohydrates.val())){
      carbohydrates.addClass('text-input-good');
    } else {
      success = false;
      carbohydrates.addClass('text-input-bad');
    }

    if(methods.validation([ ValidationTypes.POSITIVE_FLOAT ],protein.val())){
      protein.addClass('text-input-good');
    } else {
      success = false;
      protein.addClass('text-input-bad');
    }

    if(methods.validation([ ValidationTypes.POSITIVE_FLOAT ],sodium.val())){
      sodium.addClass('text-input-good');
    } else {
      success = false;
      sodium.addClass('text-input-bad');
    }

    return success

  }

  // this method takes both an array of validation methods and a value and then performs
  // the selected validation methods
  methods.validation = (types = [],value) => {

    let success = true;

    for(var type of types){

      switch(type){

        case ValidationTypes.INT            :

          break;

        case ValidationTypes.FLOAT          :

          break;

        case ValidationTypes.POSITIVE_INT   :

          success = (/^\d+$/).test(value);
          break;

        case ValidationTypes.POSITIVE_FLOAT :

          success = (/^\d*\.?\d+$/).test(value);
          break;

        case ValidationTypes.ALPHANUMERIC   :

          success = (/^[\w\s]+$/).test(value);
          break;

      }

    }


    return success;

  }

  // form save button click event
  $('#ingredient_save').on('click',() => {

    // checking if active ingredient exists or not
    if( activeIngredient ) {
      // if so ( ingredient is being edited ) save with id
      methods.updateIngredient(activeIngredient.id)

      // nb - Not clearing the form as continual edits may want to be
      // formed

    } else {
      // if not ( ingredient is being created ) perform insert
      methods.saveIngredient()

    }

  });

  // form new ingredient click event
  $('#scroll_panel_new').on('click',() => {

    $('#ingredient_grams').attr('disabled',false);

    $('.ingredient-form-title').text('Ingredient ( new )');

    if(activeIngredient)
      activeIngredient.dom.removeClass('scroll-panel-item-active')

    // setting active ( clicked on ingredient ) to null
    activeIngredient = null;

    // clearing ingredient form fields
    methods.clearIngredientForm()
    methods.validateForm()

  });

  // calling the validate method on keyup of any input in the ingredient form
  $('#ingredient-form input[type=text]').keyup(() => {
    methods.validateForm();
  })

  // initial call to set up form
  methods.validateForm();

	return methods;

}());
