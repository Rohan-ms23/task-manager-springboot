package com.rohan.taskmanager.controller;

import java.util.HashMap;
import java.util.List;


import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rohan.taskmanager.entity.Task;
import com.rohan.taskmanager.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskService service;
    
    @GetMapping
    public List<Task> getTasks() {
        return service.getAllTasks();
    }

    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        return service.saveTask(task);
    }
    

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
        return "Task Deleted";
    }

    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        return service.completeTask(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
                        @RequestBody Task task) {
        return service.updateTask(id, task);
    }

    
    @GetMapping("/search")
public List<Task> searchTasks(@RequestParam String title){
    return service.searchTasks(title);
}

@GetMapping("/status")
public List<Task> getTasksByStatus(
        @RequestParam String status) {

    return service.getTasksByStatus(status);
}
@GetMapping("/stats")
public Map<String, Long> getStats(
        @RequestParam String userEmail) {

    List<Task> tasks =
            service.getAllTasks()
                   .stream()
                   .filter(task ->
                        userEmail.equals(
                            task.getUserEmail()))
                   .toList();

    long total = tasks.size();

    long completed =
            tasks.stream()
                    .filter(task ->
                        "Completed".equals(
                            task.getStatus()))
                    .count();

    long pending =
            total - completed;

    Map<String, Long> stats =
            new HashMap<>();

    stats.put("total", total);
    stats.put("completed", completed);
    stats.put("pending", pending);

    return stats;
}
}