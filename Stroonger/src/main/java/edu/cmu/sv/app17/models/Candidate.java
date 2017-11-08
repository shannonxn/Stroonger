package edu.cmu.sv.app17.models;


public class Candidate {
     String id = null;
     String email, firstName, lastName, gender, age, country, state, city, zipCode,
            mobile, currentTitle, field, selfIntroduction;

    public Candidate(String email, String firstName, String lastName,
                     String gender, String age, String country, String state, String city,
                     String zipCode, String mobile, String currentTitle, String field,
                     String selfIntroduction) {

        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.country = country;
        this.state = state;
        this.city = city;
        this.zipCode = zipCode;
        this.mobile = mobile;
        this.currentTitle = currentTitle;
        this.field = field;
        this.selfIntroduction = selfIntroduction;
    }
    public void setId(String id) {
        this.id = id;
    }
}
