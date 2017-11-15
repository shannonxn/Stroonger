var MongoClient = require('mongodb').MongoClient;

var dbConnection = null;

var lockCount = 0;

var index = 0;



function getDbConnection(callback){
    MongoClient.connect("mongodb://localhost/stroonger", function(err, db){
        if(err){
            console.log("Unable to connect to Mongodb");
        }else{
            dbConnection = db;
            callback();
        }
    });
};

function closeConnection() {
    if (dbConnection)
        dbConnection.close();

}

getDbConnection(function(){
    dbConnection.dropDatabase(function(err,doc){
        if (err)
            console.log("Could not drop database");
        else
        {
            addAdmin();
            addCandidate();
            addCompany();
        }

    });
});

function addCandidate() {
    cand = [{
        "email": "shannon@stroonger.com",
        "password": "85HONEmGzkJE2U9YCpQbsA==", //ILoveShannon
        "firstName": "Shannon",
        "lastName": "Li",
        "gender": "Female",
        "age": "22",
        "country": "US",
        "state": "CA",
        "city": "Mountain View",
        "zipCode": "94043",
        "mobile": "1234",
        "currentTitle": "Master student at CMU",
        "field": "Software Engineering",
        "selfIntroduction": "A master student at CMU SV."
    }, {
        "email": "meredith@stroonger.com",
        "password": "u+wQxQ3iZ2FSSeJK3itt/w==", //ILoveMeredith
        "firstName": "Meredith",
        "lastName": "Li",
        "gender": "Female",
        "age": "28",
        "country": "China",
        "state": "Beijing",
        "city": "Beijing",
        "zipCode": "100000",
        "mobile": "1234",
        "currentTitle": "Master student at CMU",
        "field": "Software Management",
        "selfIntroduction": "I love Software."
    }];

    var candidate = dbConnection.collection('candidate');

    candidate.insertOne(cand[0], function(err,doc){
        if (err){
            console.log("Could not add Candidate");
        }
    });

    candidate.insertOne(cand[1], function(err,doc){
        if (err){
            console.log("Could not add Candidate");
        }
    });
}

function addAdmin() {
    ad = [{
        "email": "admin@stroonger.com",
        "password": "F/PZtTgA4k5q/9o6Jzik6w==", //decrypt: admin
        "firstName": "Stroonger",
        "lastName": "Admin"
    }];

    var admin = dbConnection.collection('admin');

    admin.insertOne(ad[0], function(err,doc){
        if (err){
            console.log("Could not add Admin");
        }
    });
}

function addCompany() {
    com = [{
        "name": "Google",
        "description": "Google’s mission is to organize the world‘s information and make it universally accessible and useful.",
        "field": "Internet",
        "location": "Mountain View, CA, US"
    }, {
        "name": "Walmart",
        "description": "At Walmart, we help people save money so they can live better. ",
        "field": "Retail",
        "location": "New York, NY, US"
    }];

    var company = dbConnection.collection('company');

    company.insertOne(com[0], function(err,doc){
        if (err){
            console.log("Could not add Company");
        }
        else {
            addPositionToCompany1(doc.ops[0]._id.toString());
        }
    });
    company.insertOne(com[1], function(err,doc){
        if (err){
            console.log("Could not add Company");
        }
        else {
            addPositionToCompany2(doc.ops[0]._id.toString());
        }
    });
}


function addPositionToCompany1(companyId) {
    pos = [{
        "name": "Software Engineer Internship",
        "type": "Internship",
        "description": "Google Software Engineer Internship in Summer 2018",
        "date": "11/07/2017",
        "location": "Mountain View, CA, US",
        "companyId": companyId
    }, {
        "name": "UI/UX Internship",
        "type": "Internship",
        "description": "Google UI/UX Internship in Summer 2018",
        "date": "11/07/2017",
        "location": "Mountain View, CA, US",
        "companyId": companyId
    }];
    pos.forEach(function(po){
        var position = dbConnection.collection('position');
        position.insertOne(po);
    })
}

function addPositionToCompany2(companyId) {
    pos = [{
        "name": "Software Engineer",
        "type": "Full Time",
        "description": "Walmart Software Engineer in Summer 2018",
        "date": "11/07/2017",
        "location": "Mountain View, CA, US",
        "companyId": companyId
    }, {
        "name": "Sales Internship",
        "type": "Internship",
        "description": "Walmart Sales Internship in Summer 2018",
        "date": "11/07/2017",
        "location": "Mountain View, CA, US",
        "companyId": companyId
    }];
    pos.forEach(function(po){
        var position = dbConnection.collection('position');
        position.insertOne(po);
    })
}

setTimeout(closeConnection,10000);