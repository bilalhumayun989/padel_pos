<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PlayerController extends Controller
{
    public function index()
    {
        $players = [];
        $names   = ['Alex Mercer', 'Sara Ahmed', 'Bilal Khan', 'Nadia Malik', 'Omar Tariq', 'Hina Rauf', 'Zain Ul', 'Fatima Noor', 'Kamran Butt', 'Ayesha Siddiq'];
        $skills  = [5.5, 6.0, 4.5, 7.0, 5.0, 6.5, 4.0, 7.5, 5.5, 6.0];
        $tiers   = ['Pro Member', 'Pro Member', 'Member', 'Pro Member', 'Member', 'Pro Member', 'Member', 'Pro Member', 'Pro Member', 'Member'];
        $avatars = [
            'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
        ];

        for ($i = 0; $i < 10; $i++) {
            $players[] = [
                'id'         => $i + 1,
                'name'       => $names[$i],
                'tier'       => $tiers[$i],
                'avatar'     => $avatars[$i],
                'skill'      => $skills[$i],
                'skill_max'  => 7.0,
                'matches'    => rand(100, 180),
                'last_visit' => $i % 3 === 0 ? 'Today' : ($i % 3 === 1 ? 'Yesterday' : '2 Days Ago'),
            ];
        }

        return Inertia::render('Players/Index', [
            'metrics' => [
                'active_players' => 43,
                'players_trend'  => 6,
                'matches_played' => 36,
                'matches_trend'  => 9,
            ],
            'players' => $players,
        ]);
    }
}
