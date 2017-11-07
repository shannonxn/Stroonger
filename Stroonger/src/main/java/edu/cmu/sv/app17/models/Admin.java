package edu.cmu.sv.app17.models;


public class Admin {
     String id = null;
     String email, firstName, lastName;

    public Admin(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    public void setId(String id) {
        this.id = id;
    }
}
