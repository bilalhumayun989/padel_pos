<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PlayerController extends Controller
{
    public function index()
    {
        return Inertia::render('Players/Index', [
            'metrics' => [
                'active_players' => 43,
                'players_trend' => 6,
                'matches_played' => 36,
                'matches_trend' => 9,
            ],
            'players' => [
                [
                    'id' => 1,
                    'name' => 'Umar Iqbal',
                    'status' => 'Active',
                    'tier' => 'Platinum',
                    'rating' => 42,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
                [
                    'id' => 2,
                    'name' => 'Saad khalid',
                    'status' => 'Active',
                    'tier' => 'Gold',
                    'rating' => 28,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
                [
                    'id' => 3,
                    'name' => 'Zohaib',
                    'status' => 'Paused',
                    'tier' => 'Silver',
                    'rating' => 14,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
                [
                    'id' => 4,
                    'name' => 'Fahad',
                    'status' => 'Active',
                    'tier' => 'Platinum',
                    'rating' => 52,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
                [
                    'id' => 5,
                    'name' => 'Umar Iqbal',
                    'status' => 'Active',
                    'tier' => 'Platinum',
                    'rating' => 42,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
                [
                    'id' => 6,
                    'name' => 'Saad khalid',
                    'status' => 'Active',
                    'tier' => 'Gold',
                    'rating' => 28,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
                [
                    'id' => 7,
                    'name' => 'Zohaib',
                    'status' => 'Paused',
                    'tier' => 'Silver',
                    'rating' => 14,
                    'wl' => '42 - 6',
                    'streak' => 'w7',
                ],
            ]
        ]);
    }
}
