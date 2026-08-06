<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class CafeController extends Controller
{
    public function index()
    {
        $products = [
            // Cafe drinks
            ['id'=>1,'name'=>'Cold Brew',    'category'=>'Cafe',   'price'=>4.50, 'image'=>'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80'],
            ['id'=>2,'name'=>'Espresso',     'category'=>'Cafe',   'price'=>3.00, 'image'=>'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80'],
            ['id'=>3,'name'=>'Cappuccino',   'category'=>'Cafe',   'price'=>4.00, 'image'=>'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80'],
            ['id'=>4,'name'=>'Iced Latte',   'category'=>'Cafe',   'price'=>4.50, 'image'=>'https://images.unsplash.com/photo-1517959105821-eaf2591984d2?auto=format&fit=crop&w=400&q=80'],
            ['id'=>5,'name'=>'Matcha Latte', 'category'=>'Cafe',   'price'=>5.00, 'image'=>'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80'],
            ['id'=>6,'name'=>'Americano',    'category'=>'Cafe',   'price'=>3.50, 'image'=>'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=400&q=80'],
            // Bundles
            ['id'=>7,'name'=>'Energy Pack',  'category'=>'Bundles','price'=>12.00,'image'=>'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80'],
            ['id'=>8,'name'=>'Game Day Box', 'category'=>'Bundles','price'=>18.00,'image'=>'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'],
            ['id'=>9,'name'=>'Hydro Bundle', 'category'=>'Bundles','price'=>9.50, 'image'=>'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80'],
        ];

        return Inertia::render('Cafe/Index', [
            'products' => $products,
        ]);
    }
}
