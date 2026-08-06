<?php
namespace App\Http\Controllers;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        return Inertia::render('Suppliers/Index', [
            'suppliers' => [
                ['id'=>1,'name'=>'Babolat Sports','category'=>'Rackets & Balls','contact'=>'Ahmed Raza','phone'=>'+92 300 1234567','email'=>'ahmed@babolat.pk','location'=>'Karachi, Pakistan','status'=>'Active','total_orders'=>24,'last_order'=>'2 days ago','balance'=>12500],
                ['id'=>2,'name'=>'Wilson Pakistan','category'=>'Rackets & Accessories','contact'=>'Sara Khan','phone'=>'+92 321 7654321','email'=>'sara@wilson.pk','location'=>'Lahore, Pakistan','status'=>'Active','total_orders'=>18,'last_order'=>'1 week ago','balance'=>8750],
                ['id'=>3,'name'=>'Head International','category'=>'Full Equipment','contact'=>'Bilal Mirza','phone'=>'+92 333 9876543','email'=>'bilal@head.pk','location'=>'Islamabad, Pakistan','status'=>'Active','total_orders'=>31,'last_order'=>'Today','balance'=>22300],
                ['id'=>4,'name'=>'Adidas Padel','category'=>'Footwear & Apparel','contact'=>'Nadia Shah','phone'=>'+92 345 1122334','email'=>'nadia@adidas.pk','location'=>'Lahore, Pakistan','status'=>'Active','total_orders'=>15,'last_order'=>'3 days ago','balance'=>6200],
                ['id'=>5,'name'=>'Nox International','category'=>'Rackets','contact'=>'Omar Tariq','phone'=>'+92 311 5544332','email'=>'omar@nox.pk','location'=>'Karachi, Pakistan','status'=>'Inactive','total_orders'=>7,'last_order'=>'2 months ago','balance'=>0],
                ['id'=>6,'name'=>'Bullpadel Supplies','category'=>'Full Equipment','contact'=>'Hina Rauf','phone'=>'+92 322 6677889','email'=>'hina@bullpadel.pk','location'=>'Faisalabad, Pakistan','status'=>'Active','total_orders'=>12,'last_order'=>'5 days ago','balance'=>9800],
            ],
            'metrics' => [
                'total_suppliers' => 6,
                'active_suppliers' => 5,
                'total_orders' => 107,
                'pending_balance' => 59550,
            ],
        ]);
    }
}
