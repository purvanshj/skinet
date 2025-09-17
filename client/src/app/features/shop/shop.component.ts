import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator} from '@angular/material/paginator';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    MatIconButton
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})

export class ShopComponent implements OnInit {

 private shopService = inject(ShopService)
 private dialogService = inject(MatDialog)
  products?:Pagination<Product>;

  sortOptions=[
    {name:'Alphabetical', value:'name'},
    {name:'Price: Low to High', value:'priceAsc'},
    {name:'Price: High to Low', value:'priceDesc'},
  ]

shopParams = new ShopParams();
pageSizeOptions=[5,10,15,20];
  ngOnInit(): void {
    this.initializeShop();
   }

   initializeShop(){
    this.shopService.getBrands();
    this.shopService.getTypes();  
    this.getProducts();
  }
  handlePageEvent(event:any){
    this.shopParams.pageNumber=event.pageIndex+1;
    this.shopParams.pageSize=event.pageSize;
    this.getProducts();
  }
  onSortChange(event:any){
    const selectedOption=event.options[0];
    if(selectedOption){
      this.shopParams.sort=selectedOption.value;
      this.shopParams.pageNumber=1;
      this.getProducts();
    }
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products=response,
      error: error=>console.log(error)
    })
  }

onSearchChange(){
  this.shopParams.pageNumber=1;
  this.getProducts();
}

  openFilterDialog(){
   const dialogRef=this.dialogService.open(FiltersDialogComponent,{
      minWidth:'500px',
      data:{
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    })

    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result){
          this.shopParams.brands=result.selectedBrands;
          this.shopParams.types=result.selectedTypes;
          this.shopParams.pageNumber=1;
          this.getProducts();
        }
      }
    })
  }
}
