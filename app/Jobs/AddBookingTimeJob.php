<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon;
use App\Models\RoomBook\BookingTime;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\RoomBook\RoomBooking;

class AddBookingTimeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $room_booking;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($room_booking_id)
    {
        $this->room_booking = RoomBooking::find($room_booking_id);
        $this->onQueue('UAIS');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $date_start = Carbon::parse($this->room_booking->start_date);
        $date_end = Carbon::parse($this->room_booking->end_date);
        $start_time = Carbon::parse($this->room_booking->start_date)->toTimeString();
        $end_time = Carbon::parse($this->room_booking->end_date)->toTimeString();
        $is_booking_type_2 = $this->room_booking->booking_type_id == 2;
        $booking_times = [];

        while ($date_start <= $date_end) {
            $date = $date_start->toDateString();
            $day_of_week = $date_start->dayOfWeek;

            if ($day_of_week == $this->room_booking->day_id) {
                if (!$is_booking_type_2 || ($is_booking_type_2 && $day_of_week != 6 && $day_of_week != 7 && !is_holiday($date))) {
                    $booking_times[] = [
                        'booking_id' => $this->room_booking->id,
                        'start_time' => $date . ' ' . $start_time,
                        'end_time'   => $date . ' ' . $end_time,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            $date_start->addDay();
        }

        BookingTime::insert($booking_times);
    }
}
