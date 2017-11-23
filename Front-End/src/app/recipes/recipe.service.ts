import {ChangeDetectorRef, Injectable, Input} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  public recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService, private http: HttpClient) {}

  getRecipes(): Promise<Recipe[]> {
    return this.http.get('http://localhost:3000/recipies').toPromise().then(response => {
      this.recipes = response as Recipe[];
      return this.recipes;
    });
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);

    this.http.post('http://localhost:3000/recipies', recipe).subscribe();

    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;

    this.http.put('http://localhost:3000/recipies/' + index, newRecipe).subscribe();

    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);

    this.http.delete('http://localhost:3000/recipies/' + index).subscribe();

    this.recipesChanged.next(this.recipes.slice());
  }
}
