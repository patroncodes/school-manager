'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'

const LessonNotes = () => {
    const [notes, setNotes] = useState("")

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lesson Notes</CardTitle>
                <CardDescription>Add notes about this lesson session</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Enter lesson notes, observations, or important points discussed..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[200px]"
                />
            </CardContent>
        </Card>
    )
}

export default LessonNotes