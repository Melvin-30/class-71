import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image,TextInput} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from "firebase";
import db from "../config.js"


export default class issues extends React.Component{
    constructor(){
        super();
        this.state={
            cameraPermission:null,
            scanned:false,
            scannedBookID:'',
            scannedStudentID:'',
            buttonState:"clicked",
            submitbutton:"normal"
        }
    }
    handleBarCodeScanner=async({type,data})=>{
        const {buttonState}=this.state
        if(buttonState="BookID"){
        this.setState({
            scanned:true,
            scannedBookID:data,
            buttonState:"normal"
        })
        }else if(buttonState="StudentId"){
            this.setState({
                scanned:true,
                scannedStudentID:data,
                buttonState:"normal"
            })  
        }
    }
    getCameraPermission=async(id)=>{
        const{status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            cameraPermission:status==="granted",
            buttonState:id,
            scanned:false
        })
    }
    handledTransaction=async()=>{
        var transactionmsg
        db.collection("Books").doc(this.state.scannedBookID).get()
        .then((doc)=>{
            var book=doc.data()
            if(book.Bookavailability){
                this.initiateBookIssue()
                transactionmsg="Book Issued"
            }else{
                this.initiateBookReturn()
                transactionmsg="Book Returned"
            }
        })
    }
    initiateBookIssue=async()=>{
        db.collection("Transaction").add({
            "StudentID":this.state.scannedStudentID,
            "BookID":this.state.scannedBookID,
            "Date":firebase.firestore.Timestamp.now().toDate(),
            "Transactiontype":"Issue"
        })
        db.collection("Books").doc(this.state.scannedBookID).update({
            "Bookavailability":false
        })
        db.collection("Students").doc(this.scannedStudentID).update({
            "BooksIssued":firebase.firestore.FieldValue.increment(1)
        })
        this.setState({
            scannedStudentID:"",
            scannedBookID:""
        })
    }
    initiateBookReturn(){
        db.collection("Transaction").add({
            "StudentID":this.state.scannedStudentID,
            "BookID":this.state.scannedBookID,
            "Date":firebase.firestore.Timestamp.now().toDate(),
            "Transactiontype":"Return"
        })
        db.collection("Books").doc(this.scannedBookID).update({
            "Bookavailability":true
        })
        db.collection("Students").doc(this.scannedStudentID).update({
            "BooksIssued":firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({
            scannedBookID:"",
            scannedStudentID:""
        })
    }
    render(){
        const cameraPermission=this.state.cameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState
        if(buttonState!=="normal"&&cameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned?undefined:this.handleBarCodeScanner}
                styles={StyleSheet.absoluteFillObject}/>
            );
        } 
        else if(buttonState==="normal"){
            return(
                <View style={styles.Container}>
                <View><Image
                source={require("../assets/booklogo.jpg")}
                style={{width:40,height:40}}
                /><Text style={{textAlign:"center",fontSize:30}}>Willy</Text>
                </View>
                <View style={styles.inputView}>
                <TextInput
                style={styles.inputBox}
                placeholder="bookID"
                value={this.state.scannedBookID}
                />
                <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>
                {this.getCameraPermission("BookId")}                
                }
                >
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput
                style={styles.inputBox}
                placeholder="StudentID"
                value={this.state.scannedStudentID}
                />
                <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>
                {this.getCameraPermission("StudentId")}                
                }
                >
                 <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity 
                    style={styles.submitButton}onPress={async()=>{var transactionmsg=await this.handledTransaction}}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )
        }
    }
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    DisplayText:{
        fontSize:20,
        textDocumentLine:'underline',
    },
    scanButton:{
        backgroundColor:"red",
        width:50,
        borderWidth:1.5,
        borderLeftWidth:0
    },
    buttonText:{
        fontSize:20,
        textAlign:'center',
        marginTop:10,
    },
    inputView:{
        flexDirection:"row",
        margin:20,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    },
    
})