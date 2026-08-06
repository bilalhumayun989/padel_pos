<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class BookingController extends Controller
{
    public function create()
    {
        return Inertia::render('Bookings/Create', [
            'courts' => [
                ['id' => 1, 'name' => 'Court 1', 'type' => 'Indoor',    'price_per_hour' => 25],
                ['id' => 2, 'name' => 'Court 2', 'type' => 'Indoor',    'price_per_hour' => 25],
                ['id' => 3, 'name' => 'Court 3', 'type' => 'Panoramic', 'price_per_hour' => 35],
                ['id' => 4, 'name' => 'Court 4', 'type' => 'Outdoor',   'price_per_hour' => 20],
                ['id' => 5, 'name' => 'Court 5', 'type' => 'Indoor',    'price_per_hour' => 25],
            ],
            'time_slots' => [
                '08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00',
                '18:00','19:00','20:00','21:00',
            ],
            'clients' => [
                ['id'=>1,'name'=>'Umar Iqbal'],
                ['id'=>2,'name'=>'Saad Khalid'],
                ['id'=>3,'name'=>'Zohaib Ahmed'],
                ['id'=>4,'name'=>'Fahad Khan'],
                ['id'=>5,'name'=>'Ali Hassan'],
            ],
        ]);
    }

    public function store()
    {
        // Placeholder — would validate & save
        return redirect()->route('schedule.index');
    }
}
