<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        return Inertia::render('Teams/Index', [
            'teams' => [
                [
                    'id'           => 1,
                    'name'         => 'Team Alpha',
                    'captain'      => 'Umar Iqbal',
                    'members'      => ['Umar Iqbal', 'Saad Khalid', 'Zohaib Ahmed', 'Fahad Khan'],
                    'skill_level'  => 'Advanced',
                    'court'        => 'Court 1',
                    'court_booked' => true,
                    'booking_date' => '2024-10-24',
                    'booking_time' => '6:00 PM',
                    'payment'      => 'Paid',
                    'payment_amount' => 100,
                    'wins'         => 12,
                    'losses'       => 3,
                    'matches'      => 15,
                    'status'       => 'Active',
                    'created_at'   => '2024-01-15',
                    'image'        => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
                [
                    'id'           => 2,
                    'name'         => 'Team Smashers',
                    'captain'      => 'Ali Hassan',
                    'members'      => ['Ali Hassan', 'Bilal Mirza', 'Nadia Shah', 'Omar Tariq'],
                    'skill_level'  => 'Intermediate',
                    'court'        => 'Court 2',
                    'court_booked' => true,
                    'booking_date' => '2024-10-25',
                    'booking_time' => '4:00 PM',
                    'payment'      => 'Unpaid',
                    'payment_amount' => 80,
                    'wins'         => 8,
                    'losses'       => 5,
                    'matches'      => 13,
                    'status'       => 'Active',
                    'created_at'   => '2024-02-20',
                    'image'        => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
                [
                    'id'           => 3,
                    'name'         => 'Thunder Rackets',
                    'captain'      => 'Hina Rauf',
                    'members'      => ['Hina Rauf', 'Sara Ahmed'],
                    'skill_level'  => 'Beginner',
                    'court'        => null,
                    'court_booked' => false,
                    'booking_date' => null,
                    'booking_time' => null,
                    'payment'      => 'N/A',
                    'payment_amount' => 0,
                    'wins'         => 2,
                    'losses'       => 6,
                    'matches'      => 8,
                    'status'       => 'Active',
                    'created_at'   => '2024-03-10',
                    'image'        => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
                [
                    'id'           => 4,
                    'name'         => 'Pro Padelers',
                    'captain'      => 'Kamran Butt',
                    'members'      => ['Kamran Butt', 'Ayesha Siddiq', 'Zain Ul', 'Fatima Noor'],
                    'skill_level'  => 'Pro',
                    'court'        => 'Court 3',
                    'court_booked' => true,
                    'booking_date' => '2024-10-26',
                    'booking_time' => '8:00 PM',
                    'payment'      => 'Paid',
                    'payment_amount' => 140,
                    'wins'         => 20,
                    'losses'       => 2,
                    'matches'      => 22,
                    'status'       => 'Active',
                    'created_at'   => '2024-01-05',
                    'image'        => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
            ],
            'metrics' => [
                'total_teams'    => 4,
                'active_teams'   => 4,
                'courts_booked'  => 3,
                'total_matches'  => 58,
            ],
        ]);
    }
}
