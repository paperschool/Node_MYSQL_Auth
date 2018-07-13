
const db = require('./db');

// this method is to rebuild the database when ran
function build(){

  // user table creation query
  db.query(
    `CREATE TABLE IF NOT EXISTS ${'tblUsers'} (`+
      `id INT NOT NULL UNIQUE AUTO_INCREMENT,`+
      `username VARCHAR(20)  NOT NULL UNIQUE,`+
      `email    VARCHAR(100) NOT NULL UNIQUE ,`+
      `password BINARY(60)   ,`+
      `role     VARCHAR(20)   ,`+
      `PRIMARY KEY (id)`+
    `);`
  )

  // session table for active sessions
  db.query(
    `CREATE TABLE IF NOT EXISTS ${'sessions'} ( `+
    `session_id varchar(128) COLLATE utf8mb4_bin NOT NULL,`+
    `expires int(11) unsigned NOT NULL,`+
    `data text COLLATE utf8mb4_bin,`+
    `PRIMARY KEY (session_id)`+
    `) ENGINE=InnoDB`
  );

  db.query(
    `CREATE TABLE IF NOT EXISTS ${'tblIngredients'} (`+
    `id INT NOT NULL UNIQUE AUTO_INCREMENT,`+
    `userid INT NOT NULL,`+
    `name VARCHAR(100) NOT NULL,`+
    `calories FLOAT(20,3) NOT NULL,`+
    `fat FLOAT(20,3) NOT NULL,`+
    `protein FLOAT(20,3) NOT NULL,`+
    `carbohydrates FLOAT(20,3) NOT NULL,`+
    `sodium FLOAT(20,3) NOT NULL,`+
    `tags VARCHAR(80) NOT NULL,`+
    `PRIMARY KEY (id),`+
    `FOREIGN KEY (userid) REFERENCES tblUsers(id) ON DELETE CASCADE`+
    `) ENGINE=InnoDB`
  )

  db.query(
    `CREATE TABLE IF NOT EXISTS ${'tblRecipes'} (`+
    `id INT NOT NULL UNIQUE AUTO_INCREMENT,`+
    // `userid INT NOT NULL,`+
    `ingredientid INT NOT NULL,`+
    `name VARCHAR(20) NOT NULL,`+
    `description VARCHAR(80) NOT NULL,`+
    `PRIMARY KEY (id),`+
    // `FOREIGN KEY (userid) REFERENCES tblUsers(id) ON DELETE CASCADE,`+
    `FOREIGN KEY (ingredientid) REFERENCES tblIngredients(id) ON DELETE CASCADE`+
    `) ENGINE=InnoDB`
  )



}

function testConnection(){
  db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    if(results[0].solution === 2);
      // console.log('Database Connection Test Successful');
  });
}

module.exports.build = build;
module.exports.test = testConnection;
