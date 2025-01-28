import CardDataStats from '@/Components/CardDataStats'
import React from 'react'
import { CarFront, FileBarGraph, FileCheck, FilePlus, FileRichtext, Files } from 'react-bootstrap-icons'

const Statistics = () => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-6 2xl:gap-2">
            <CardDataStats
                title="Total Blotters"
                total="0"
                rate="0"
                remark={1}
                routeTo="provinces"
                levelUp
            >
                <Files size={24} color="blue" />
            </CardDataStats>

            <CardDataStats
                title="Subject for hearing"
                total="0"
                rate="0"
                remark={1}
                routeTo="provinces"
                levelUp
            >
                <FileBarGraph size={24} color="blue" />
            </CardDataStats>

            <CardDataStats
                title="Pending incidents"
                total="0"
                rate="0"
                remark={1}
                routeTo="provinces"
                levelUp
            >
                <FileRichtext size={24} color="blue" />
            </CardDataStats>

            <CardDataStats
                title="Referred to PNP"
                total="0"
                rate="0"
                remark={1}
                routeTo="provinces"
                levelUp
            >
                <CarFront size={24} color="blue" />
            </CardDataStats>

            <CardDataStats
                title="Amicably Settled"
                total="0"
                rate="0"
                remark={1}
                routeTo="provinces"
                levelUp
            >
                <FileCheck size={24} color="blue" />
            </CardDataStats>

            <CardDataStats
                title="Other Type Of Blotter"
                total="0"
                rate="0"
                remark={1}
                routeTo="provinces"
                levelUp
            >
                <FilePlus size={24} color="blue" />
            </CardDataStats>
        </div >
    )
}

export default Statistics