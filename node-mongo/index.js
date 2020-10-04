const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dbOperation = require("./operations");

const url = "mongodb://localhost:27017/";
const dbName = "conFusion";

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);
  console.log("Connected correctly to server");
  const db = client.db(dbName);
  dbOperation.insertDocument(
    db,
    { name: "Vadonut", description: "Test" },
    "dishes",
    (result) => {
      console.log("Insert Document:\n", result.ops);

      dbOperation.findDocuments(db, "dishes", (docs) => {
        console.log("Found Documents:\n", docs);

        dbOperation.updateDocument(
          db,
          { name: "Vadonut" },
          { description: "Updated Test" },
          "dishes",
          (result) => {
            console.log("Updated Document:\n", result.result);

            dbOperation.findDocuments(db, "dishes", (docs) => {
              console.log("Found Updated Documents:\n", docs);

              db.dropCollection("dishes", (result) => {
                console.log("Dropped Collection: ", result);

                client.close();
              });
            });
          }
        );
      });
    }
  );
});
