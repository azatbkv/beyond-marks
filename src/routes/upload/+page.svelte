<script lang="ts">
    import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
    <div>
        <label for="subject">Subject</label>
        <input id="subject" type="text" name="subject" />
    </div>
    <div>
        <label for="olympiad">Olympiad</label>
        <input id="olympiad" type="text" name="olympiad" />
    </div>
    <div>
        <label for="year">Year</label>
        <input id="year" type="number" name="year" />
    </div>
    <div>
        <label for="file">JSON file</label>
        <input id="file" type="file" name="file" />
    </div>
    <div>
        <label for="password">Password</label>
        <input id="password" type="password" name="password" />
    </div>
    <button type="submit">Upload</button>
</form>