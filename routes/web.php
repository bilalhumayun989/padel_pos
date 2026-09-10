<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::patch('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::post('/courts', [CourtController::class, 'store'])->name('courts.store');
    Route::put('/courts/{court}', [CourtController::class, 'update'])->name('courts.update');
    Route::delete('/courts/{court}', [CourtController::class, 'destroy'])->name('courts.destroy');
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::put('/teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::post('/memberships', [MembershipController::class, 'store'])->name('memberships.store');
    Route::put('/memberships/{membership}', [MembershipController::class, 'update'])->name('memberships.update');
    Route::delete('/memberships/{membership}', [MembershipController::class, 'destroy'])->name('memberships.destroy');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
    Route::post('/players', [PlayerController::class, 'store'])->name('players.store');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::post('/cafe', [CafeController::class, 'store'])->name('cafe.store');
    Route::post('/memberships/enroll', [MembershipController::class, 'enroll'])->name('memberships.enroll');
    Route::post('/history/expenses', [HistoryController::class, 'storeExpense'])->name('expenses.store');
    Route::post('/history/purchases', [HistoryController::class, 'storePurchase'])->name('purchases.store');
    Route::post('/history/reconciliation', [HistoryController::class, 'storeReconciliation'])->name('reconciliation.store');
    Route::post('/support', [SupportController::class, 'store'])->name('support.store');
    Route::put('/stock/{stock}', [StockController::class, 'update'])->name('stock.update');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('/players', [PlayerController::class, 'index'])->name('players.index');
    Route::get('/cafe', [CafeController::class, 'index'])->name('cafe.index');
    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::get('/products',         [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/cafe',    [ProductController::class, 'cafe'])->name('products.cafe');
    Route::get('/products/paddle',  [ProductController::class, 'paddle'])->name('products.paddle');
    Route::get('/courts',           [CourtController::class, 'index'])->name('courts.index');
    Route::get('/memberships',      [MembershipController::class, 'index'])->name('memberships.index');
    Route::get('/teams',             [TeamController::class,  'index'])->name('teams.index');
    Route::get('/reports/revenue',   [ReportController::class,'revenue'])->name('reports.revenue');
    Route::get('/reports/expenses',  [ReportController::class,'expenses'])->name('reports.expenses');
    Route::get('/reports/bookings',  [ReportController::class,'bookings'])->name('reports.bookings');
    Route::get('/reports/cafe',      [ReportController::class,'cafe'])->name('reports.cafe');
    Route::get('/reports/players',   [ReportController::class,'players'])->name('reports.players');
    Route::get('/history/sales',          [HistoryController::class, 'sales'])->name('history.sales');
    Route::get('/history/purchases',      [HistoryController::class, 'purchases'])->name('history.purchases');
    Route::get('/history/expenses',       [HistoryController::class, 'expenses'])->name('history.expenses');
    Route::get('/history/reconciliation', [HistoryController::class, 'reconciliation'])->name('history.reconciliation');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/support', [SupportController::class, 'index'])->name('support.index');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
