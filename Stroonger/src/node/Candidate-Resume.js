var MongoClient = require('mongodb').MongoClient;

var dbConnection = null;

var lockCount = 0;

var index = 0;



function getDbConnection(callback){
    MongoClient.connect("mongodb://localhost/app17-7", function(err, db){
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
            addCandidate();
    });
});

function addCandidate() {
    cand = [{
        "email": "candidate1@gmail.com",
        "password": "IRfCRpniy1YeRW9mIHBgkA==",
        "firstName": "Name#1",
        "lastName": "Candidate#1",
        "gender": "Female",
        "age": "22",
        "country": "US",
        "state": "CA",
        "city": "MTV",
        "zipCode": "94043",
        "mobile": "1231231234",
        "currentTitle": "Student#1 at CMU",
        "field": "Software Management",
        "selfIntroduction": "I am Candidate #1."
    }, {
        "email": "candidate2@gmail.com",
        "password": "TqzXNDSIXSuDPlN1ODJerA==",
        "firstName": "Name#2",
        "lastName": "Candidate#2",
        "gender": "Male",
        "age": "29",
        "country": "US",
        "state": "CA",
        "city": "LA",
        "zipCode": "94045",
        "mobile": "2342342345",
        "currentTitle": "Student#2 at UCLA",
        "field": "Software Engineering",
        "selfIntroduction": "I am Candidate #2."
    }, {
        "email": "candidate3@gmail.com",
        "password": "4hivmjbYz/kHjB6JoRIG/Q==",
        "firstName": "Name#3",
        "lastName": "Candidate#3",
        "gender": "Female",
        "age": "20",
        "country": "US",
        "state": "NY",
        "city": "NY",
        "zipCode": "94000",
        "mobile": "3453453456",
        "currentTitle": "Student#3 at NYU",
        "field": "Finance",
        "selfIntroduction": "I am Candidate #3."
    }];


    var candidates = dbConnection.collection('candidates');

    candidates.insertOne(cand[0], function(err,doc){
        if (err){
            console.log("Could not add Candidate #1");
        }
        else {
            addResumesToCandidate(doc.ops[0]._id.toString(),53);
        }
    })
    candidates.insertOne(cand[1], function(err,doc){
        if (err){
            console.log("Could not add Candidate #2");
        }
        else {
            addResumesToCandidate(doc.ops[0]._id.toString(),59);
        }
    })
    candidates.insertOne(cand[2], function(err,doc){
        if (err){
            console.log("Could not add Candidate #3");
        }
        else {
            addResumesToCandidate(doc.ops[0]._id.toString(),68);
        }
    })
}



// fileLinkList = ['localhost://8080/api/resume/no#1','localhost://8080/api/resume/no#2','localhost://8080/api/resume/no#3','localhost://8080/api/resume/no#4','localhost://8080/api/resume/no#5','localhost://8080/api/resume/no#6','localhost://8080/api/resume/no#7'];
versionNameList = ['Resume-version#1','Resume-version#2','Resume-version#3', 'Resume-version#4', 'Resume-version#5'];
uploadTimeList = ['20100903', '20120406', '20130820','20141028', '20150405', '20160302','20170919','20130304','20101012','20170803', '20090301','20140506','20161221','20171020'];

function addResumesToCandidate(ownerId, count) {
    sequence = Array(count);
    console.log("sequence",sequence);
    var c = [];
    for (i = 0; i < count; i++){
        console.log("Trying")

        var file = "localhost://8080/api/resume/no#" + index;
        var version = versionNameList[Math.floor(Math.random() * versionNameList.length)];
        var time = uploadTimeList[Math.floor(Math.random() * uploadTimeList.length)];


        c.push ({
            fileLink: file,
            versionName: version,
            uploadTime: time,
            ownerId: ownerId
        });

        index++;

    }

    c.forEach(function(resume){
        var resumes = dbConnection.collection('resumes');
        resumes.insertOne(resume);
    })

}

setTimeout(closeConnection,10000);