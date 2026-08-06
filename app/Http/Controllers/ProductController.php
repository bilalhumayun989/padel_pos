<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return redirect()->route('products.cafe');
    }

    public function cafe()
    {
        return Inertia::render('Products/Index', [
            'tab'       => 'cafe',
            'products'  => $this->cafeProducts(),
            'suppliers' => $this->supplierList(),
            'metrics'   => ['total' => 10, 'active' => 9, 'low_stock' => 1, 'categories' => 3],
        ]);
    }

    public function paddle()
    {
        return Inertia::render('Products/Index', [
            'tab'       => 'paddle',
            'products'  => $this->paddleProducts(),
            'suppliers' => $this->supplierList(),
            'metrics'   => ['total' => 6, 'active' => 6, 'low_stock' => 0, 'categories' => 2],
        ]);
    }

    private function supplierList(): array
    {
        return [
            ['id' => 1, 'name' => 'Babolat Sports'],
            ['id' => 2, 'name' => 'Wilson Pakistan'],
            ['id' => 3, 'name' => 'Head International'],
            ['id' => 4, 'name' => 'Adidas Padel'],
            ['id' => 5, 'name' => 'Nox International'],
            ['id' => 6, 'name' => 'Bullpadel Supplies'],
        ];
    }

    private function cafeProducts(): array
    {
        return [
            ['id'=>1, 'name'=>'Cold Brew Coffee',  'category'=>'Drinks',  'price'=>4.50, 'cost'=>2.00, 'stock'=>45, 'unit'=>'cup',    'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>2, 'name'=>'Espresso Shot',      'category'=>'Drinks',  'price'=>3.00, 'cost'=>1.20, 'stock'=>60, 'unit'=>'cup',    'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>3, 'name'=>'Cappuccino',          'category'=>'Drinks',  'price'=>4.00, 'cost'=>1.80, 'stock'=>50, 'unit'=>'cup',    'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>4, 'name'=>'Matcha Latte',        'category'=>'Drinks',  'price'=>5.00, 'cost'=>2.20, 'stock'=>35, 'unit'=>'cup',    'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>5, 'name'=>'Americano',           'category'=>'Drinks',  'price'=>3.50, 'cost'=>1.30, 'stock'=>55, 'unit'=>'cup',    'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>6, 'name'=>'Iced Latte',          'category'=>'Drinks',  'price'=>4.50, 'cost'=>1.90, 'stock'=> 8, 'unit'=>'cup',    'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1517959105821-eaf2591984d2?auto=format&fit=crop&w=400&q=80', 'status'=>'Low Stock'],
            ['id'=>7, 'name'=>'Chocolate Croissant', 'category'=>'Snacks',  'price'=>3.50, 'cost'=>1.50, 'stock'=>20, 'unit'=>'piece',  'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>8, 'name'=>'Protein Bar',         'category'=>'Snacks',  'price'=>4.00, 'cost'=>2.00, 'stock'=>30, 'unit'=>'piece',  'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>9, 'name'=>'Energy Bundle',       'category'=>'Bundles', 'price'=>18.00,'cost'=>9.00, 'stock'=>20, 'unit'=>'bundle', 'supplier'=>'Bullpadel Supplies',  'image'=>'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>10,'name'=>'Water Bottle (500ml)','category'=>'Drinks',  'price'=>1.50, 'cost'=>0.50, 'stock'=>100,'unit'=>'bottle', 'supplier'=>null,                  'image'=>'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
        ];
    }

    private function paddleProducts(): array
    {
        return [
            ['id'=>20,'name'=>'Babolat Padel Balls (3pk)', 'category'=>'Balls',   'price'=>12.00, 'cost'=>6.50, 'stock'=>30, 'unit'=>'pack', 'supplier'=>'Babolat Sports',    'image'=>'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>21,'name'=>'Wilson Padel Balls (3pk)',  'category'=>'Balls',   'price'=>11.00, 'cost'=>5.50, 'stock'=>25, 'unit'=>'pack', 'supplier'=>'Wilson Pakistan',   'image'=>'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>22,'name'=>'Nox AT10 Racket',           'category'=>'Rackets', 'price'=>180.00,'cost'=>90.00,'stock'=> 6, 'unit'=>'piece','supplier'=>'Nox International', 'image'=>'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>23,'name'=>'Bullpadel Vertex Racket',   'category'=>'Rackets', 'price'=>220.00,'cost'=>110.00,'stock'=>4, 'unit'=>'piece','supplier'=>'Bullpadel Supplies','image'=>'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>24,'name'=>'Head Alpha Pro Racket',     'category'=>'Rackets', 'price'=>195.00,'cost'=>95.00,'stock'=> 5, 'unit'=>'piece','supplier'=>'Head International','image'=>'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
            ['id'=>25,'name'=>'Wilson Blade Racket',       'category'=>'Rackets', 'price'=>165.00,'cost'=>80.00,'stock'=> 8, 'unit'=>'piece','supplier'=>'Wilson Pakistan',   'image'=>'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80', 'status'=>'Active'],
        ];
    }
}
