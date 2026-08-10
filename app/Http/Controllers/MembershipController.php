<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index()
    {
        return Inertia::render('Memberships/Index', [
            'plans' => [
                [
                    'id'          => 1,
                    'name'        => 'Basic Member',
                    'badge'       => 'Member',
                    'price'       => 1500,
                    'duration'    => 30,
                    'color'       => 'gray',
                    'status'      => 'Active',
                    'subscribers' => 12,
                    'perks'       => [
                        '5% discount on bookings',
                        'Priority court booking',
                        'Monthly newsletter',
                    ],
                ],
                [
                    'id'          => 2,
                    'name'        => 'Pro Member',
                    'badge'       => 'Pro Member',
                    'price'       => 3500,
                    'duration'    => 30,
                    'color'       => 'lime',
                    'status'      => 'Active',
                    'subscribers' => 28,
                    'perks'       => [
                        '15% discount on all bookings',
                        'Free court booking (2/month)',
                        '10% off cafe items',
                        'Priority scheduling',
                        'Exclusive Pro badge',
                    ],
                ],
                [
                    'id'          => 3,
                    'name'        => 'Elite Member',
                    'badge'       => 'Elite',
                    'price'       => 7000,
                    'duration'    => 30,
                    'color'       => 'white',
                    'status'      => 'Active',
                    'subscribers' => 7,
                    'perks'       => [
                        '25% discount on all bookings',
                        'Unlimited free court bookings',
                        '20% off cafe items',
                        'VIP lounge access',
                        'Personal coach sessions (2/month)',
                        'Elite badge + profile',
                    ],
                ],
            ],
            'metrics' => [
                'total_plans'    => 3,
                'active_members' => 47,
                'monthly_revenue'=> 187500,
                'new_this_month' => 8,
            ],
        ]);
    }
}
