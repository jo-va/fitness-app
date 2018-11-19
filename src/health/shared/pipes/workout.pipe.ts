import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appWorkout'
})
export class WorkoutPipe implements PipeTransform {
    transform(value: any) {
        if (value.type === 'endurance') {
            return `Distance: ${value.endurance.distance}km, ` +
                `Duration: ${value.endurance.duration}mins`;
        } else {
            return `Weight: ${value.strength.weight}km, ` +
                `Reps: ${value.strength.reps}, ` +
                `Sets: ${value.strength.sets}`;
        }
    }
}
