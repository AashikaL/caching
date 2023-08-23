import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CachingService } from '../services/caching.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  users = null;
  joke: any;
  constructor(private apiService: ApiService, private loadingController: LoadingController, private cachingService: CachingService) { }

  async loadChuckJoke(forceRefresh: any) {
    const loading = await this.loadingController.create({
      message: 'Loading data...'
    });
    await loading.present();

    this.apiService.getChuckJoke(forceRefresh).subscribe(res => {
      this.joke = res;
      loading.dismiss();
    })
  }

  async refreshUsers(event?: any) {
    const loading = await this.loadingController.create({
      message: 'Loading data..'
    });
    await loading.present();

    const refresh = event ? true : false;

    this.apiService.getUsers(refresh).pipe(
      finalize(() => {
        if (event) {
          event.target.complete();
        }
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log('rese: ', res);

      this.users = res;
    });
  }

  async clearCache() {
    this.cachingService.clearCachedData();
  }

}
