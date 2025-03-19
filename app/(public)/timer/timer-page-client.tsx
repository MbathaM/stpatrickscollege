'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type Exam = {
  _id: string
  name: string
  duration: number
  newDuration: number
  date: string
  grade: string | null
  subject: string | null
}

type Student = {
  _id: string
  userId: string
  name: string
  email: string | null
  isStudent: boolean
  hasConcession: boolean
  concessionType: string | null
  concessionTime: number | null
  exams: Exam[]
}

type TimerState = {
  studentId: string
  examId: string
  timeRemaining: number
  isActive: boolean
  originalTime: number
}

export function TimerPageClient({ data }: { data: Student[] }) {
  const [timers, setTimers] = useState<Record<string, TimerState>>({});
  
  // Function to format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to calculate progress percentage
  const calculateProgress = (timeRemaining: number, originalTime: number) => {
    return Math.max(0, Math.min(100, (timeRemaining / originalTime) * 100));
  };

  // Start timer for a specific student and exam
  const startTimer = (studentId: string, examId: string, duration: number) => {
    const timerKey = `${studentId}-${examId}`;
    
    // If timer already exists, just activate it
    if (timers[timerKey]) {
      setTimers(prev => ({
        ...prev,
        [timerKey]: {
          ...prev[timerKey],
          isActive: true
        }
      }));
    } else {
      // Create a new timer
      setTimers(prev => ({
        ...prev,
        [timerKey]: {
          studentId,
          examId,
          timeRemaining: duration * 60, // Convert minutes to seconds
          isActive: true,
          originalTime: duration * 60
        }
      }));
    }
  };

  // Pause timer
  const pauseTimer = (studentId: string, examId: string) => {
    const timerKey = `${studentId}-${examId}`;
    
    setTimers(prev => ({
      ...prev,
      [timerKey]: {
        ...prev[timerKey],
        isActive: false
      }
    }));
  };

  // Reset timer
  const resetTimer = (studentId: string, examId: string, duration: number) => {
    const timerKey = `${studentId}-${examId}`;
    
    setTimers(prev => ({
      ...prev,
      [timerKey]: {
        ...prev[timerKey],
        timeRemaining: duration * 60,
        isActive: false,
        originalTime: duration * 60
      }
    }));
  };

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        Object.keys(updated).forEach(key => {
          if (updated[key].isActive && updated[key].timeRemaining > 0) {
            updated[key] = {
              ...updated[key],
              timeRemaining: updated[key].timeRemaining - 1
            };
            hasChanges = true;
          } else if (updated[key].isActive && updated[key].timeRemaining <= 0) {
            updated[key] = {
              ...updated[key],
              isActive: false
            };
            hasChanges = true;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Exam Timer</h1>
      
      {data.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Exams Today</CardTitle>
            <CardDescription>There are no exams scheduled for today.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-8">
          {data.map(student => (
            <Card key={student._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>
                  {student.email}
                  {student.hasConcession && (
                    <span className="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      Concession: {student.concessionTime} min/hour
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Original Duration</TableHead>
                      <TableHead>Adjusted Duration</TableHead>
                      <TableHead>Timer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.exams.map(exam => {
                      const timerKey = `${student._id}-${exam._id}`;
                      const timer = timers[timerKey];
                      
                      return (
                        <TableRow key={exam._id}>
                          <TableCell className="font-medium">{exam.name}</TableCell>
                          <TableCell>{exam.subject}</TableCell>
                          <TableCell>{exam.grade}</TableCell>
                          <TableCell>{exam.duration} min</TableCell>
                          <TableCell>
                            {exam.newDuration} min
                            {exam.newDuration !== exam.duration && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (+{exam.newDuration - exam.duration} min)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="text-xl font-mono">
                                {timer ? formatTime(timer.timeRemaining) : formatTime(exam.newDuration * 60)}
                              </div>
                              <Progress 
                                value={timer ? calculateProgress(timer.timeRemaining, timer.originalTime) : 100} 
                                className={timer && timer.timeRemaining < 300 ? 'bg-red-200' : ''}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {(!timer || !timer.isActive) ? (
                                <Button 
                                  onClick={() => startTimer(student._id, exam._id, exam.newDuration)}
                                  size="sm"
                                >
                                  {!timer ? 'Start' : 'Resume'}
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => pauseTimer(student._id, exam._id)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Pause
                                </Button>
                              )}
                              <Button 
                                onClick={() => resetTimer(student._id, exam._id, exam.newDuration)}
                                variant="outline"
                                size="sm"
                              >
                                Reset
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}