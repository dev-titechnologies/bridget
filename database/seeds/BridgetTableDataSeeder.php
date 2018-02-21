<?php

use Illuminate\Database\Seeder;
use App\BridgetComments;

class BridgetTableDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$faker = \Faker\Factory::create();
    	$url=$faker->url;
    	$counter=0;
    	for ($i=1; $i <= 3; $i++) { 
    		$counter++;
            $bridgetComments=new BridgetComments();
            $bridgetComments->username=$faker->userName;
            $bridgetComments->comment=$faker->text;
            $bridgetComments->parent_id=null;
            $bridgetComments->browser_fingerprint=$counter;
            $bridgetComments->url=$url;
            $bridgetComments->save();
            for($j=1;$j<5;$j++){
             $counter++;
             $bridgetComments1=new BridgetComments();
             $bridgetComments1->username=$faker->userName;
             $bridgetComments1->comment=$faker->text;
             $bridgetComments1->parent_id=$bridgetComments->_id;
             $bridgetComments1->browser_fingerprint=$counter;
             $bridgetComments1->url=$url;
             $bridgetComments1->save();
         }

     }
 }
}
