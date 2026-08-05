<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Index', [
            'metrics' => [
                'total_clients' => 43,
                'clients_trend' => 6,
                'today_bookings' => 36,
                'bookings_trend' => 9,
            ],
            'clients' => [
                [
                    'id' => 1,
                    'name' => 'Umar Iqbal',
                    'status' => 'Active',
                    'tier' => 'Platinum',
                    'visits' => 42,
                    'last_visit' => 'Today',
                    'lifetime' => '$1,201',
                ],
                [
                    'id' => 2,
                    'name' => 'Saad khalid',
                    'status' => 'Active',
                    'tier' => 'Gold',
                    'visits' => 28,
                    'last_visit' => 'Yesterday',
                    'lifetime' => '$1,201',
                ],
                [
                    'id' => 3,
                    'name' => 'Zohaib',
                    'status' => 'Paused',
                    'tier' => 'Silver',
                    'visits' => 14,
                    'last_visit' => '3 Days Ago',
                    'lifetime' => '$1,201',
                ],
                [
                    'id' => 4,
                    'name' => 'Fahad',
                    'status' => 'Active',
                    'tier' => 'Platinum',
                    'visits' => 52,
                    'last_visit' => 'Today',
                    'lifetime' => '$1,201',
                ],
                [
                    'id' => 5,
                    'name' => 'Umar Iqbal',
                    'status' => 'Active',
                    'tier' => 'Platinum',
                    'visits' => 42,
                    'last_visit' => 'Today',
                    'lifetime' => '$1,201',
                ],
                [
                    'id' => 6,
                    'name' => 'Saad khalid',
                    'status' => 'Active',
                    'tier' => 'Gold',
                    'visits' => 28,
                    'last_visit' => 'Yesterday',
                    'lifetime' => '$1,201',
                ],
                [
                    'id' => 7,
                    'name' => 'Zohaib',
                    'status' => 'Paused',
                    'tier' => 'Silver',
                    'visits' => 14,
                    'last_visit' => '3 Days Ago',
                    'lifetime' => '$1,201',
                ],
            ]
        ]);
    }
}
