package edu.cmu.sv.app17.models;

import edu.cmu.sv.app17.helpers.APPCrypt;

public class HeadhunterSession {

    String token = null;
    String userId = null;
    String firstName, lastName, gender, age, country, state, city, zipCode,
            mobile, bankaccount, routenumber;

    public HeadhunterSession(Headhunter headhunter) throws Exception{
        this.userId = headhunter.id;
        this.token = APPCrypt.encrypt(headhunter.id);
        this.firstName = headhunter.firstName;
        this.lastName = headhunter.lastName;
        this.gender = headhunter.gender;
        this.age = headhunter.age;
        this.country = headhunter.country;
        this.state = headhunter.state;
        this.city = headhunter.city;
        this.zipCode = headhunter.zipCode;
        this.mobile = headhunter.mobile;
        this.bankaccount = headhunter.bankaccount;
        this.routenumber = headhunter.routenumber;
    }
}
