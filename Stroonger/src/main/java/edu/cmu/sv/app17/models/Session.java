package edu.cmu.sv.app17.models;

import edu.cmu.sv.app17.helpers.APPCrypt;

public class Session {

    String token = null;
    String userId = null;
    String firstName, lastName, gender, age, country, state, city, zipCode,
            mobile, currentTitle, field, selfIntroduction;

    public Session(Candidate candidate) throws Exception{
        this.userId = candidate.id;
        this.token = APPCrypt.encrypt(candidate.id);
        this.firstName = candidate.firstName;
        this.lastName = candidate.lastName;
        this.gender = candidate.gender;
        this.age = candidate.age;
        this.country = candidate.country;
        this.state = candidate.state;
        this.city = candidate.city;
        this.zipCode = candidate.zipCode;
        this.mobile = candidate.mobile;
        this.currentTitle = candidate.currentTitle;
        this.field = candidate.field;
        this.selfIntroduction = candidate.selfIntroduction;
    }
}
