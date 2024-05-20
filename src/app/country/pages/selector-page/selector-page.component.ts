import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})

export class SelectorPageComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
  ) { }

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  })

  ngOnInit(): void {
    this.onRegionChanged();
  }

  get regions(): Region[] {
    return this.countryService.regions;
  }

  //Metodo para tener el OnInit lo mas legible posible
  private onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .subscribe(region => {
        console.log({ region })
      });
  }
}
