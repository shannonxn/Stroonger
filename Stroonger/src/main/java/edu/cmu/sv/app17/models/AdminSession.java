package edu.cmu.sv.app17.models;

import edu.cmu.sv.app17.helpers.APPCrypt;

public class AdminSession {

    String token = null;
    String adminId = null;
    String email = null;
    String firstName = null;
    String lastName = null;

    public AdminSession(Admin admin) throws Exception{
        this.adminId = admin.id;
        this.token = APPCrypt.encrypt(admin.id);
        this.email = admin.email;
        this.firstName = admin.firstName;
        this.lastName = admin.lastName;
    }
}
