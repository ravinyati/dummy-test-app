import { AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { MeasureComponent } from './measure/measure.component';
import { MeasuresModel, KeysModel } from 'src/app/model/recon';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { MessageActionDialogComponent } from '../message-action-dialog/message-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KeysComponent } from './keys/keys.component';
@Component({
  selector: 'app-key-measure',
  templateUrl: './key-measure.component.html',
  styleUrls: ['./key-measure.component.scss']
})
export class KeyMeasureComponent implements AfterViewInit {

  keysDataSource:any= {};
  measureDataSource:any= {};
  @ViewChild(MeasureComponent) measureComp!: MeasureComponent;
  @ViewChild(KeysComponent) keysComp!: KeysComponent;
  

  constructor(private _apiService: ApiService, private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
   
  }
  ngAfterViewInit() {
    if(this.measureComp) {
      this.measureComp.dataModified.subscribe((modifiedData: MeasuresModel[]) => {
        console.log('Data received from Child to parent:', modifiedData);
        this.measureDataSource = modifiedData;
      });
    }
    if(this.keysComp) {
      this.keysComp.dataModified.subscribe((modifiedData: KeysModel[]) => {
        console.log('Data received from Child to parent:', modifiedData);
        this.keysDataSource = modifiedData;
      });
     
    }
  }

  async onSave() {
    if (this.keysComp && this.measureComp) {
      const responseKeys = await this.keysComp.validateAndSave();
      const responseMeasures = await this.measureComp.validateAndSave();
      if(responseKeys && responseKeys.length > 0 && responseMeasures && responseMeasures.length > 0) {
        console.log('Keys data received in parent:', responseKeys, responseMeasures);
        let storageFrom = localStorage.getItem('RECON_FORM_DATA');
        const formData =  storageFrom ? JSON.parse(storageFrom) : null;
        formData.measures_data = responseMeasures;
        formData.keys_data = responseKeys;
        localStorage.setItem("RECON_FORM_DATA", JSON.stringify(formData))
        this.router.navigate(['./recon'])
      }
    } else {
      console.error('keys component not initialized');
    }
  }
  cancelRecon() {
    const dialogRef = this.dialog.open(MessageActionDialogComponent, {
      width: '365px',
      data: {
        title: `Cancel Recon`,
        message: 'There are unsaved changes. Do you want to Cancel?',
        firstButtonName: 'No',
        secondButtonName: 'Yes'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
          this.router.navigate(['./default-recon'])
      }
    });
  }

}
