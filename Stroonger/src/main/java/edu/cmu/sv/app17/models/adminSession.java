package edu.cmu.sv.app17.models;

import edu.cmu.sv.app17.helpers.APPCrypt;

public class adminSession {

    String token = null;
    String password = null;
    String firstName = null;
    String lastName = null;
    String email = null;

    public adminSession(Admin admin) throws Exception{
        this.token = APPCrypt.encrypt(admin.id);
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
