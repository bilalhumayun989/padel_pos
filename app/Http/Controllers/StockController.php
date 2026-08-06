<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        $items = [];
        $names = [
            'Babolat Team Paddle Balls',
            'Head Alpha Pro Racket',
            'Wilson Padel Grip Tape',
            'Bullpadel Vertex Racket',
            'Adidas Padel Shoes',
            'Nox AT10 Racket',
            'Penn Padel Balls (3pk)',
            'Tecnifibre Padel Bag',
            'Prince Padel Glove',
        ];
        $skus = [
            'Ball-Bab-02','Rack-Hd-Pro','Grip-Wls-01',
            'Rack-Bul-Vtx','Shoe-Adi-Pad','Rack-Nox-10',
            'Ball-Pnn-3pk','Bag-Tcf-01','Glv-Prc-01',
        ];
        $stocks   = [5,2,12,3,8,1,15,4,7];
        $maxStock = [8,6,20,6,12,4,20,8,10];
        $unitPrices = [245,380,15,420,195,390,22,145,28];
        $statuses = ['Low','Low','Good','Low','Good','Low','Good','Low','Good'];

        for ($i = 0; $i < 9; $i++) {
            $items[] = [
                'id'        => $i + 1,
                'name'      => $names[$i],
                'sku'       => $skus[$i],
                'stock'     => $stocks[$i],
                'max_stock' => $maxStock[$i],
                'unit_price'=> $unitPrices[$i],
                'value'     => $stocks[$i] * $unitPrices[$i],
                'status'    => $statuses[$i],
            ];
        }

        return Inertia::render('Stock/Index', [
            'metrics' => [
                'total_skus'     => 433,
                'skus_trend'     => 6,
                'low_stock'      => 36,
                'low_trend'      => -9,
                'monthly_sales'  => 1220,
                'sales_trend'    => 9,
            ],
            'items' => $items,
        ]);
    }
}
