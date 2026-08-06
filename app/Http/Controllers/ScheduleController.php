<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $courts = [
            ['id' => 1, 'name' => 'Court 1', 'type' => 'Indoor',    'active' => true],
            ['id' => 2, 'name' => 'Court 2', 'type' => 'Indoor',    'active' => true],
            ['id' => 3, 'name' => 'Court 3', 'type' => 'Panoramic', 'active' => true],
            ['id' => 4, 'name' => 'Court 4', 'type' => 'Outdoor',   'active' => false],
            ['id' => 5, 'name' => 'Court 5', 'type' => 'Indoor',    'active' => true],
        ];

        $bookings = [
            // Court 1
            ['id'=>1,'court_id'=>1,'team'=>'Team Alpha',  'players'=>12,'ratio'=>'4/4','start'=>8, 'end'=>13,'status'=>'booked','avatars'=>['A','B','C']],
            ['id'=>2,'court_id'=>1,'team'=>'Team Smashers','players'=>12,'ratio'=>'4/4','start'=>13,'end'=>17,'status'=>'reserved','avatars'=>['D','E','F']],
            // Court 2
            ['id'=>3,'court_id'=>2,'team'=>'Team Alpha',  'players'=>12,'ratio'=>'4/4','start'=>8, 'end'=>13,'status'=>'booked','avatars'=>['A','B','C']],
            ['id'=>4,'court_id'=>2,'team'=>'Team Smashers','players'=>12,'ratio'=>'4/4','start'=>13,'end'=>17,'status'=>'reserved','avatars'=>['D','E','F']],
            // Court 3
            ['id'=>5,'court_id'=>3,'team'=>'Team Alpha',  'players'=>12,'ratio'=>'4/4','start'=>8, 'end'=>13,'status'=>'booked','avatars'=>['A','B','C']],
            ['id'=>6,'court_id'=>3,'team'=>'Team Smashers','players'=>12,'ratio'=>'4/4','start'=>13,'end'=>17,'status'=>'reserved','avatars'=>['D','E','F']],
            // Court 4
            ['id'=>7,'court_id'=>4,'team'=>'Team Alpha',  'players'=>12,'ratio'=>'4/4','start'=>8, 'end'=>13,'status'=>'booked','avatars'=>['A','B','C']],
            ['id'=>8,'court_id'=>4,'team'=>'Team Smashers','players'=>12,'ratio'=>'4/4','start'=>13,'end'=>17,'status'=>'reserved','avatars'=>['D','E','F']],
            // Court 5 — maintenance
            ['id'=>9,'court_id'=>5,'team'=>'Maintenance','players'=>0,'ratio'=>'','start'=>8,'end'=>20,'status'=>'maintenance','avatars'=>[]],
        ];

        return Inertia::render('Schedule/Index', [
            'courts'   => $courts,
            'bookings' => $bookings,
            'today'    => now()->format('l, M d'),
        ]);
    }
}
