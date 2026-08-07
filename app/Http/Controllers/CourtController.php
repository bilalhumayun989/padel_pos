<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class CourtController extends Controller
{
    public function index()
    {
        return Inertia::render('Courts/Index', [
            'courts' => [
                [
                    'id'            => 1,
                    'name'          => 'Court 1',
                    'type'          => 'Indoor',
                    'location'      => 'Ground Floor, Block A',
                    'price_per_hour'=> 25,
                    'status'        => 'Active',
                    'capacity'      => 4,
                    'surface'       => 'Glass',
                    'lights'        => true,
                    'description'   => 'Professional indoor court with panoramic glass walls.',
                    'image'         => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
                [
                    'id'            => 2,
                    'name'          => 'Court 2',
                    'type'          => 'Indoor',
                    'location'      => 'Ground Floor, Block A',
                    'price_per_hour'=> 25,
                    'status'        => 'Active',
                    'capacity'      => 4,
                    'surface'       => 'Glass',
                    'lights'        => true,
                    'description'   => 'Standard indoor court, perfect for training sessions.',
                    'image'         => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
                [
                    'id'            => 3,
                    'name'          => 'Court 3',
                    'type'          => 'Panoramic',
                    'location'      => 'First Floor, Block B',
                    'price_per_hour'=> 35,
                    'status'        => 'Active',
                    'capacity'      => 4,
                    'surface'       => 'Panoramic Glass',
                    'lights'        => true,
                    'description'   => 'Premium panoramic court with full glass walls and city views.',
                    'image'         => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
                [
                    'id'            => 4,
                    'name'          => 'Court 4',
                    'type'          => 'Outdoor',
                    'location'      => 'Rooftop, Block C',
                    'price_per_hour'=> 20,
                    'status'        => 'Maintenance',
                    'capacity'      => 4,
                    'surface'       => 'Artificial Turf',
                    'lights'        => true,
                    'description'   => 'Open-air rooftop court with artificial turf surface.',
                    'image'         => 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
                ],
            ],
            'metrics' => [
                'total'       => 4,
                'active'      => 3,
                'maintenance' => 1,
                'revenue_today' => 280,
            ],
        ]);
    }
}
