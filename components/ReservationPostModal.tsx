import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TextField from './TextField'
import CustomDatePicker from './DatePicker'
import CustomTimePicker from './TimePicker'
import { GoChevronLeft } from "react-icons/go";
import NumericStepper from './NumericStepper'
import Button from './Button'
import { supabase } from '@/config/supabaseClient'
import formatNumberWithDot from '@/utils/formatNumber'
import generateRandomCode from '@/utils/generateRandomCode'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

interface ReservationFormProps {
    onClick: () => void;
    setTrigger: () => void;
}

function ReservationPostModal(props: ReservationFormProps) {
    const { onClick, setTrigger } = props;

    const [maxDur, setMaxDur] = useState<number>(6);
    const [noLap, setNoLap] = useState<string>("1");
    const [price, setPrice] = useState<number | null>(0);
    const [time, setTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date);
    const [duration, setDuration] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const router = useRouter()
    const handleDurationChange = (value: number) => {
        setDuration(value);
    };

    useEffect(() => {
        setDuration(1)
        if (time) {
            if (time == "23:00") {
                setMaxDur(1)
            } else if (time == "22:00") {
                setMaxDur(2)
            } else if (time == "21:00") {
                setMaxDur(3)
            } else if (time == "20:00") {
                setMaxDur(4)
            } else if (time == "19:00") {
                setMaxDur(5)
            } else {
                setMaxDur(6)
            }
        }
    }, [time])

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('fields')
            .select('*')
            .eq("no_lapangan", noLap);

        if (error) {
            console.error('Supabase error:', error.message, error.details);
            throw error;
        }

        if (data && selectedDate && time) {
            setButtonDisabled(false)
            const day = selectedDate.getDay()
            if (day == 0 || day == 6)
                setPrice(data[0].harga_weekend * duration);
            else
                setPrice(data[0].harga_weekday * duration);
        } else {
            setButtonDisabled(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedDate, duration, noLap, time])


    const handleSubmit = async () => {
        if (!buttonDisabled) {
            const { data: { user } } = await supabase.auth.getUser()
            try {
                const uniquePath = user?.id + '/' + Date.now() + "_" + uuidv4();

                const { data: imgData, error: imgErr } = await supabase.storage
                    .from('payment_proof')
                    .upload(uniquePath, file!, {
                        contentType: "image/*"
                    });
                if (imgErr) {
                    console.error('Error uploading file:', imgErr);
                    return;
                }

                const { data, error } = await supabase
                    .from('reservations')
                    .insert(
                        {
                            reservation_id: uuidv4(),
                            reserver_id: user?.id,
                            date: selectedDate,
                            no_lapangan: noLap,
                            total_price: price,
                            booking_code: generateRandomCode(10),
                            payment_proof: {
                                path: null,
                                url: null
                            },
                            time: time,
                            duration: duration,
                            payment_date: new Date(),
                        },
                    );

                if (error) {
                    alert('Reservasi gagal!');
                } else {
                    alert('Reservasi sukses!');
                    setTrigger()
                }

            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <Sidebar>
            <div className="flex flex-col justify-between h-full">
                <div className="">
                    <div className='flex items-center text-xl gap-2'>
                        <button onClick={() => { onClick(); setSelectedDate(new Date) }}>
                            <GoChevronLeft />
                        </button>
                        <h1 className='text-xl'>Formulir Reservasi</h1>
                    </div>
                    <div className="mt-12 flex flex-col gap-4">
                        <div className="w-2/5">
                            <h3>Nomor Lapangan</h3>
                            <TextField value={noLap} onChange={(e) => setNoLap(e.target.value)} />
                        </div>
                        <div className="w-2/5">
                            <h3>Tanggal</h3>
                            <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} minDate={new Date()} />
                        </div>
                        <div className="w-1/3">
                            <h3>Waktu Mulai</h3>
                            <div className="flex items-center gap-2">
                                <CustomTimePicker value={time} onChange={setTime} variant='outline' /> WIB
                            </div>
                        </div>
                        <div className="w-2/5">
                            <h3>Durasi</h3>
                            <div className="flex items-center gap-2">
                                <NumericStepper value={duration} minValue={1} maxValue={maxDur} onChange={handleDurationChange} />
                                jam
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="">
                        <p>Total harga:</p>
                        <p className='text-secondary'>Rp{price && formatNumberWithDot(price)}</p>
                    </div>
                    <Button disabled={buttonDisabled} onClick={handleSubmit} variant='secondary'>Submit</Button>
                </div>
            </div>
        </Sidebar>
    )
}

export default ReservationPostModal