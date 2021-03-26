import { Component, NgZone, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-teacherlist',
  templateUrl: './teacherlist.page.html',
  styleUrls: ['./teacherlist.page.scss'],
})
export class TeacherlistPage implements OnInit {
  base64Image: string;
  Image: string;
  loginUID: any;
  imagestatus: any="no";
  cameraSetting : CameraOptions = {
    quality: 100,
    sourceType : 1,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    //targetWidth:500,
     // targetHeight:500,
    allowEdit:true
    };
    cameraSettingGallery : CameraOptions = {
      quality: 100,
      sourceType : 2,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      //targetWidth:500,
      //targetHeight:500,
      allowEdit:true
      };
  constructor(private actioncontrol:ActionSheetController,private camera: Camera,private zone: NgZone) { 

  }

  ngOnInit() {
  }



  async attach_file() {
    console.log("attached file clicked.............................");
    const alert = await this.actioncontrol.create({
      header: 'choose Image',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            let base = this;
            this.Camera();
            console.log("camera");
          }
        }, {
          text: 'Gallery',
          role: 'destructive',
          icon: 'color-palette',
          handler: () => {
            this.Gallery();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          console.log('Cancel clicked');
         
          }
          
        }
      ]
    });

    await alert.present();
  } 

  Camera() {
    const optionsCamera: CameraOptions = {
      quality: 100,
      targetWidth: 600,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(optionsCamera).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.zone.run(() => {
      this.Image = this.base64Image;
      console.log(this.Image);
      this.imagestatus = "yes";
      })
    }, (err) => {
      console.log(err)
    })
  
  }
  Gallery() {
    const optionsGallery: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(optionsGallery).then((imageData) => {
      console.log(imageData);
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.zone.run(() => {
      this.Image = this.base64Image;
      this.uploadImage(imageData,"ourimage.jpeg").then(data=>{
        // console.log(this.Image);
        this.imagestatus = "yes";
        console.log(data);
      })
      
      })
    }, (err) => {
      // Handle error
      console.log(err)
    })
   
  }

  saveImage(){
    firebase.database().ref("imagetest").push({
      image64: this.Image,
      uploadedby: localStorage.getItem("loginUID") 
    })
    this.Image = "";
    
  }
  public uploadImage(blobData : any, ImageName : any){
    //let base = this;
    return new  Promise(function (resolve, reject) {
      let storageRef = firebase.storage().ref('assets/AttachFile');
      let ref = storageRef.child(ImageName);
      ref.putString(blobData, 'base64', {contentType: 'image/jpeg'}).then(function (snapshot: any) {
        ref.getDownloadURL().then((url)=>{
          resolve(url)
        })
      }, function (error: any) {
        reject({
          status : "failed",
          URL : error.code
        });
      });
    });
  }

}
