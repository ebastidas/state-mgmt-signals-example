import { inject, Injectable, signal } from "@angular/core";
import { AppStore } from "../app/app.store";
import { createEffect } from "../create-effect";
import { PageEvent } from "@angular/material/paginator";
import { debounceTime, tap } from "rxjs";

@Injectable()
export class ShipsStore {
  private readonly appStore = inject(AppStore);
  private readonly state = {
    $page: signal<number>(0),
    $pageSize: signal<number>(10),
    $displayDescriptions: signal<boolean>(false),
  } as const;

  public readonly $items = this.appStore.$ships;
  public readonly $loading = this.appStore.$loadingShips;
  public readonly $page = this.state.$page.asReadonly();
  public readonly $pageSize = this.state.$pageSize.asReadonly();
  public readonly $displayDescriptions = this.state.$displayDescriptions.asReadonly();

  public readonly paginated = createEffect<PageEvent>(_ => _.pipe(
    debounceTime(250),
    tap((event) => {
      this.state.$page.set(event.pageIndex);
      this.state.$pageSize.set(event.pageSize);
    })
  ));
}