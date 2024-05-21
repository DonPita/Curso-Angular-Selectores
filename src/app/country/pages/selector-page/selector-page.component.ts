import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

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

  public countriesByRegion: SmallCountry[] = [];
  public borders: string[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    countries: ['', Validators.required],
    border: ['', Validators.required],
  })

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countryService.regions;
  }

  //Metodo para tener el OnInit lo mas legible posible
  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('countries')!.setValue('')), //Poner el valor a string vacio, cuando haces el cambio de region
        tap(() => this.borders = []), //Poner el valor a string vacio, cuando haces el cambio de region
        switchMap(region => this.countryService.getCountriesByRegion(region)),
      )
      .subscribe(countries => {
        this.countriesByRegion = countries.sort((c1, c2) =>
          c1.name.localeCompare(c2.name)) //Ordenar los paises alfabeticamente.
      })
  }

  onCountryChanged(): void {
    this.myForm.get('countries')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')), //Poner el valor a string vacio, cuando haces el cambio de region
        filter((value: string) => value.length > 0),
        switchMap(alphacode => this.countryService.getCountryByAlphaCode(alphacode)),
      )
      .subscribe(country => {
        console.log({ borders: country.borders })
        this.borders = country.borders;
      })
    // .subscribe(countries => {
    //   this.countriesByRegion = countries.sort((c1, c2) =>
    //     c1.name.localeCompare(c2.name)) //Ordenar los paises alfabeticamente.
  }
}


