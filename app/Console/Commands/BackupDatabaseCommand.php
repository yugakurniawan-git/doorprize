<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\DbDumper\Databases\MySql;

class BackupDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:db';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'backup database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Mysql::create()
            ->setDbName(config('database.connections.mysql.database'))
            ->setUserName(config('database.connections.mysql.username'))
            ->setPassword(config('database.connections.mysql.password'))
            ->setHost(config('database.connections.mysql.host'))
            ->setPort(config('database.connections.mysql.port'))
            ->dumpToFile('storage/app/backup/db-backup-'. date('Y-m-d') .'.sql');
        $this->info('the database successfully backup at storage/app/backup/db-backup-'. date('Y-m-d') .'.sql');
    }
}
