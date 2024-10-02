package com.example.demo.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDBTable(tableName = "DSW")
public class DSW {

    @DynamoDBHashKey(attributeName = "dswCollegeName")
    private String dswCollegeName;

    @DynamoDBAttribute(attributeName = "dswCollegeEmail")
    private String dswCollegeEmail;

    @DynamoDBAttribute(attributeName = "dswMobileNo")
    private String dswMobileNo;

    @DynamoDBAttribute(attributeName = "dswPassword")
    private String dswPassword;

}
