<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HistoryController extends Controller
{
    private function sampleTransactions(): array
    {
        $items = [
            'Cold Brew x2 - Racket x1',
            'Espresso x1 - Padel Balls x3',
            'Court Booking - 2h',
            'Cappuccino x2 - Grip Tape x1',
            'Court Booking - 1h',
            'Iced Latte x1',
            'Game Day Bundle x1',
            'Court Booking - 1.5h',
        ];
        $clients = ['Umar Iqbal', 'Saad Khalid', 'Zohaib Ahmed', 'Fahad Khan', 'Ali Hassan'];
        $cats    = ['Cafe', 'Cafe', 'Bookings', 'Cafe', 'Bookings', 'Cafe', 'Bundles', 'Bookings'];
        $prices  = [198, 145, 250, 120, 125, 45, 180, 175];
        $txns    = [];

        for ($i = 0; $i < 16; $i++) {
            $idx = $i % count($items);
            $txns[] = [
                'id'       => 2041 + $i,
                'item'     => $items[$idx],
                'category' => $cats[$idx],
                'client'   => $clients[$i % count($clients)],
                'time'     => ($i % 3 === 0 ? '8:20 PM' : ($i % 3 === 1 ? '2:15 PM' : '11:30 AM')),
                'amount'   => $prices[$idx],
                'status'   => $i % 7 === 3 ? 'Refunded' : ($i % 9 === 5 ? 'Cancelled' : 'Completed'),
                'group'    => $i < 8 ? 'Today' : 'Yesterday',
            ];
        }
        return $txns;
    }

    private function sampleExpenses(): array
    {
        $names = ['Court Maintenance','Staff Salary','Utility Bill','Equipment Purchase','Cleaning Supplies','Marketing'];
        $amts  = [450, 1200, 380, 850, 95, 300];
        $cats  = ['Maintenance','Payroll','Utilities','Equipment','Supplies','Marketing'];
        $exps  = [];
        for ($i = 0; $i < 10; $i++) {
            $idx = $i % count($names);
            $exps[] = [
                'id'       => 1001 + $i,
                'name'     => $names[$idx],
                'category' => $cats[$idx],
                'amount'   => $amts[$idx],
                'date'     => $i < 5 ? 'Today' : 'Yesterday',
                'by'       => 'Admin',
            ];
        }
        return $exps;
    }

    public function sales()
    {
        return Inertia::render('History/Index', [
            'tab'          => 'sales',
            'transactions' => $this->sampleTransactions(),
            'expenses'     => [],
            'metrics'      => [
                'total_events'  => 12,
                'events_trend'  => 6,
                'refunds'       => 1,
                'refunds_total' => 12.00,
                'refunds_trend' => -9,
                'cancellations' => 1,
                'cancel_trend'  => 0,
            ],
        ]);
    }

    public function purchases()
    {
        $items   = ['Padel Racket x1','Padel Balls x3','Grip Tape x2','Court Shoes x1','Padel Bag x1','Wristband x4'];
        $vendors = ['Babolat','Wilson','Head','Adidas','Nox'];
        $prices  = [380, 45, 28, 195, 145, 18];
        $cats    = ['Equipment','Equipment','Accessories','Footwear','Accessories','Accessories'];
        $txns    = [];

        for ($i = 0; $i < 12; $i++) {
            $idx = $i % count($items);
            $txns[] = [
                'id'       => 5001 + $i,
                'item'     => $items[$idx],
                'category' => $cats[$idx],
                'client'   => $vendors[$i % count($vendors)],
                'time'     => $i % 2 === 0 ? '10:30 AM' : '3:45 PM',
                'amount'   => $prices[$idx],
                'status'   => $i % 8 === 3 ? 'Returned' : 'Completed',
                'group'    => $i < 6 ? 'Today' : 'Yesterday',
            ];
        }

        return Inertia::render('History/Index', [
            'tab'          => 'purchases',
            'transactions' => $txns,
            'expenses'     => [],
            'metrics'      => [
                'total_events'  => 12,
                'events_trend'  => 4,
                'refunds'       => 1,
                'refunds_total' => 380,
                'refunds_trend' => -5,
                'cancellations' => 0,
                'cancel_trend'  => 0,
            ],
        ]);
    }

    public function reconciliation()
    {
        $sessions = [];
        $shifts   = ['Morning (8am–2pm)', 'Afternoon (2pm–8pm)', 'Evening (8pm–Close)'];
        $cashiers = ['Umar Iqbal', 'Saad Khalid', 'Fahad Khan'];

        for ($i = 0; $i < 6; $i++) {
            $expected = rand(800, 2500);
            $actual   = $expected + rand(-200, 150);
            $sessions[] = [
                'id'          => 3001 + $i,
                'shift'       => $shifts[$i % 3],
                'cashier'     => $cashiers[$i % 3],
                'date'        => $i < 3 ? 'Today' : 'Yesterday',
                'expected'    => $expected,
                'actual'      => $actual,
                'variance'    => $actual - $expected,
                'status'      => abs($actual - $expected) < 50 ? 'Balanced' : ($actual > $expected ? 'Over' : 'Short'),
            ];
        }

        return Inertia::render('History/Index', [
            'tab'          => 'reconciliation',
            'transactions' => [],
            'expenses'     => [],
            'reconciliation' => $sessions,
            'metrics'      => [
                'total_events'  => count($sessions),
                'events_trend'  => 2,
                'refunds'       => 0,
                'refunds_total' => 0,
                'refunds_trend' => 0,
                'cancellations' => 0,
                'cancel_trend'  => 0,
            ],
        ]);
    }

    public function expenses()
    {
        return Inertia::render('History/Index', [
            'tab'          => 'expenses',
            'transactions' => [],
            'expenses'     => $this->sampleExpenses(),
            'metrics'      => [
                'total_events'  => 10,
                'events_trend'  => 3,
                'refunds'       => 0,
                'refunds_total' => 0,
                'refunds_trend' => 0,
                'cancellations' => 0,
                'cancel_trend'  => 0,
            ],
        ]);
    }
}
