package edu.cmu.sv.app17.models;


public class Headhunter {
     String id = null;
     String email, firstName, lastName, gender, age, country, state, city, zipCode,
            mobile, bankaccount, routenumber;

    public Headhunter(String email, String firstName, String lastName,
                      String gender, String age, String country, String state, String city,
                      String zipCode, String mobile, String bankaccount, String routenumber) {

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
        this.bankaccount = bankaccount;
        this.routenumber = routenumber;

    }
    public void setId(String id) {
        this.id = id;
    }
}
