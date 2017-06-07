angular.module("app", ['ngRoute'])
	.controller('RecipesController', function($scope, dataService, $location, sharedDataService){
				
		//function used to change route path to /add.
		$scope.addRecipe = function( ){
			sharedDataService.setReadOnly(false);
			$location.path('/add');
		};
		$scope.editRecipe = function(path){
			sharedDataService.setReadOnly(false);
			$location.path('/edit/'+path);
		};
		
		$scope.viewRecipe = function(path){
			sharedDataService.setReadOnly(true);
			$location.path('/'+path);
		};
		
		
		
		
		$scope.detectChange = function(){
			//console.log("detected Change");
			//console.log($scope.currentCategory.name);
			
			//Loops through comparing the recipes to the categories to check if any recipe exist in that category.
			for(var i=0; i<$scope.recipes.length; i++){
				if($scope.currentCategory.name === $scope.recipes[i].category) {
					//If finds one, sets isRecipes to true and returns
					$scope.isRecipes = true;
					return;
				}
			}
			//If these lines hit. No recipes matching category found, can set to false and return;
			$scope.isRecipes = false;
			return;
		};
		
		dataService.getCategories(function(response){
			//console.log(response.data);
			$scope.categories = response.data;
		});
		
		dataService.getRecipes(function(response){
			//console.log(response.data);
			$scope.isRecipes =true;
			$scope.recipes = response.data;
		});
		
		
		
		
	})
	.controller('RecipeDetailController', function($scope, $location, dataService, sharedDataService){
		//console.log("hit the Recipe Detail Controller?");

		//Function used to change Route Path to Index.
		$scope.returnHome = function(){
			sharedDataService.setReadOnly(false);
			$location.path('/');
		};
		
		
		
		$scope.onLoad = function(){
			var param = $location.path();
			
			/*
			REaaaaaaaaaaally need to refactor this code. it's messy >.>
			 */
			if(param.search('/add')===-1 && param.search('/edit')===-1){
				sharedDataService.setReadOnly(true);
			}
			else{
				sharedDataService.setReadOnly(false);
			}
			$scope.isReadOnly = sharedDataService.getReadOnly();
			
			console.log($scope.isReadOnly);
			
			if(param.search("/add")===-1){
				
				console.log("we are in the edit");
				dataService.getRecipes(function(response){
					$scope.isEdit = true;
					$scope.recipeEditing = response.data;
					var recipeId = param.substring(param.lastIndexOf('/')+1, param.length);
					var result = $scope.recipeEditing.filter(function(obj){
						return obj._id == recipeId;
					});
					$scope.recipeEditing = result[0];

					//$scope.currentFoodItem = $scope.recipeEditing.ingredients[0].foodItem;
					console.log($scope.recipeEditing);
				});
				//When editing is true;
				
			}
			else{
				$scope.isEdit = false;
				console.log("we are in the add");
				
				var recipe =
					{
						name: '',
						description: '',
						category: '',
						prepTime: null,
						cookTime: null,
						ingredients: [
							{
								foodItem: '',
								condition: '',
								amount: ''
							}
						],
						steps: [ 
							{
								description: ''
							}
						],
					};
				$scope.recipeEditing = recipe;
				//Need to instantiate a full array here!!!!! of the recipe object.....
				console.log($scope.recipeEditing);
			}
			
		};
		
		
		dataService.getCategories(function(response){
			//console.log(response.data);
			$scope.categories = response.data;
		});
		
		dataService.getFoodItems(function(response){
			$scope.foodItems = response.data;
		});
		
		
		$scope.deleteIngredient = function(ingredient, index){
		//	dataService.deleteIngredient(ingredient);
			$scope.recipeEditing.ingredients.splice(index, 1);
			
			//console.log($scope.recipeEditing);
		};
		
		$scope.addIngredient = function(){
			var obj =
			{
				foodItem: '',
				condition: '',
				amount: ''
			};
			$scope.recipeEditing.ingredients.push(obj);
		};
		
		$scope.addStep = function() {
			var obj = { description: ''};
			$scope.recipeEditing.steps.push(obj);
		};
		
		$scope.deleteStep = function(index){
			$scope.recipeEditing.steps.splice(index, 1);
		}
		

		
		
		
		
		
		
	})
	.service('dataService', function($http){
		
		this.getCategories = function(callback){
			$http.get('http://localhost:5000/api/categories')
				.then(callback)
		};
		
		this.getRecipes = function(callback){
			$http.get('http://localhost:5000/api/recipes')
				.then(callback)
		};
		
		this.getFoodItems = function(callback){
			$http.get('http://localhost:5000/api/fooditems')
				.then(callback)
		};
		
		
		this.deleteIngredient = function(ingredient){
			console.log("The ingredient has been deleted!");
			
			//Will need to communicate with database eventually in here!!
		};
		
		
	})
	.service('sharedDataService', function(){
		var isReadOnly = false;
		this.setReadOnly = function(set){
			isReadOnly = set;
		};
		
		this.getReadOnly = function(){
			return isReadOnly;
		}
	});