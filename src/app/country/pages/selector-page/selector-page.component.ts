import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry, Name } from '../../interfaces/country.interfaces';
import { switchMap } from 'rxjs';

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

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    countries: ['', Validators.required],
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
      .pipe(
        switchMap(region => this.countryService.getCountriesByRegion(region)),
      )
      .subscribe(countries => {
        this.countriesByRegion = countries.sort((c1, c2) =>
          c1.name.localeCompare(c2.name)) //Ordenar los paises alfabeticamente.
      })
  }
}

