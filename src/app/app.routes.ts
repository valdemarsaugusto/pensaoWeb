import { Routes } from "@angular/router";
import { CalendarioComponent } from "./calendario/calendario";
import { MuralComponent } from "./mural/mural";
import { FinanceiroComponent } from "./financeiro/financeiro";
import { GenitorComponent } from "./genitor/genitor/genitor";
import { FotosComponent } from "./fotos/fotos";

// app.routes.ts ou app-routing.module.ts
export const routes: Routes = [
  { path: 'calendario', component: CalendarioComponent },
  { path: 'mural', component: MuralComponent }, // se você tiver esse componente
  { path: 'financeiro', component: FinanceiroComponent},
  { path: 'genitor', component: GenitorComponent }, // <-- VEJA SE ESTA LINHA EXISTE
  { path: 'foto', component: FotosComponent},
  { path: '', redirectTo: '/foto', pathMatch: 'full' } // redireciona para a agenda ao abrir
];