<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\BridgetComments;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        BridgetComments::saving(function ($commentInstance) {
            $commentInstance->comment=htmlentities($commentInstance->comment);
            return true;
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
