import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from "@angular/forms";
import {ContactsService} from "../contacts/contacts.service";
import {addressTypeValues, phoneTypeValues} from "../contacts/contact.model";
import {restrictedWords} from "../validators/restricted-words.validator";

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;

  contactForm = this.fb.nonNullable.group({
    id: '',
    icon: '',
    personal: false,
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>null,
    phones: this.fb.array([this.createPhoneGroup()]),
    address: this.fb.nonNullable.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: ['', Validators.required],
    }),
    notes: ['', restrictedWords(['foo', 'bar'])],
  });

  constructor(private route: ActivatedRoute,
              private router: Router,
              private contactsService: ContactsService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;

    this.contactsService.getContact(contactId)
      .subscribe((contact) => {
        if (!contact) return;

        // if you need to initialize just some values, use patchValue
        // const names = {firstName: contact.firstName, lastName: contact.lastName};
        // this.contactForm.patchValue(names);

        for (let i = 1; i < contact.phones.length; i++) {
          this.addPhone();
        }

        this.contactForm.setValue(contact);
      })
  }

  public createPhoneGroup() {
    return this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
    })
  }

  public addPhone() {
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  saveContact() {
    console.log(this.contactForm.value);
    this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts'])
    })
  }

}
