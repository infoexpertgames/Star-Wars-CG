import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { CardComponent } from './card/card.component';
import { CardsProviderService } from './services/cards-provider.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CardComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
  ],
  providers: [CardsProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
