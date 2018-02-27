package edu.cmu.sv.app17.models;

public class Application {

    String id = null;
    String userId, companyId, positionId, resumeId;
    String userFN, userLN, posName, comName;
    String applyDate, statue;
    Boolean isHeadhunter;

    public Application(String companyId, String positionId, String userId, String resumeId,
                       String userFN, String userLN, String posName, String comName,
                       String applyDate, String statue,
                       Boolean isHeadhunter) {

        this.companyId = companyId;
        this.positionId = positionId;
        this.userId = userId;
        this.resumeId = resumeId;
        this.userFN = userFN;
        this.userLN = userLN;
        this.posName = posName;
        this.comName = comName;
        this.applyDate = applyDate;
        this.statue = statue;
        this.isHeadhunter = isHeadhunter;

    }
    public void setId(String id) {
        this.id = id;
    }
}
