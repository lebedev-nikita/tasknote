import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTRPC } from "./trpc";

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function TaskScreen(props: Props) {
  const insets = useSafeAreaInsets();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const tasks = useQuery(trpc.tasks.list.queryOptions());
  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        setTitle("");
        await queryClient.invalidateQueries(trpc.tasks.list.queryFilter());
      },
    }),
  );
  const setDone = useMutation(
    trpc.tasks.setDone.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tasks.list.queryFilter());
      },
    }),
  );
  const [title, setTitle] = useState("");
  const trimmedTitle = title.trim();
  const canCreate = trimmedTitle.length > 0 && !createTask.isPending;

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    createTask.mutate({ title: trimmedTitle });
  };

  return (
    <View style={[props.style, styles.safeArea]}>
      <ScrollView
        contentContainerStyle={[
          styles.shell,
          {
            paddingTop: Math.max(insets.top, 24) + 8,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Tasknote</Text>
          <Text style={styles.title}>Tasks</Text>
        </View>

        <View style={styles.composer}>
          <TextInput
            accessibilityLabel="Task title"
            onChangeText={setTitle}
            onSubmitEditing={handleCreate}
            placeholder="Add a task"
            returnKeyType="done"
            style={styles.input}
            value={title}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!canCreate}
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.addButton,
              pressed ? styles.addButtonPressed : undefined,
              !canCreate ? styles.addButtonDisabled : undefined,
            ]}
          >
            <Text style={styles.addButtonText}>{createTask.isPending ? "Adding" : "Add"}</Text>
          </Pressable>
        </View>

        {createTask.error ?
          <Text style={styles.errorText}>{createTask.error.message}</Text>
        : null}

        <View style={styles.taskList}>
          {tasks.isLoading ?
            <View style={styles.centerState}>
              <ActivityIndicator />
              <Text style={styles.mutedText}>Loading tasks</Text>
            </View>
          : null}

          {tasks.error ?
            <View style={styles.centerState}>
              <Text style={styles.errorText}>{tasks.error.message}</Text>
            </View>
          : null}

          {tasks.data?.length === 0 ?
            <View style={styles.centerState}>
              <Text style={styles.mutedText}>No tasks yet</Text>
            </View>
          : null}

          {tasks.data?.map((task) => (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: task.done }}
              key={task.taskId}
              onPress={() => setDone.mutate({ id: task.taskId, done: !task.done })}
              style={({ pressed }) => [styles.taskRow, pressed ? styles.taskRowPressed : undefined]}
            >
              <View style={[styles.checkbox, task.done ? styles.checkboxDone : undefined]}>
                <Text style={styles.checkboxMark}>{task.done ? "✓" : ""}</Text>
              </View>
              <View style={styles.taskTextGroup}>
                <Text style={[styles.taskTitle, task.done ? styles.taskDone : undefined]}>
                  {task.title}
                </Text>
                <Text style={styles.taskDate}>{new Date(task.createdAt).toLocaleString()}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#f7f7f2",
  },
  shell: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 18,
  },
  header: {
    gap: 4,
  },
  eyebrow: {
    color: "#5c6b57",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#171914",
    fontSize: 40,
    fontWeight: "800",
  },
  composer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    minHeight: 48,
    flex: 1,
    borderWidth: 1,
    borderColor: "#cfd6c6",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    color: "#171914",
    fontSize: 16,
    paddingHorizontal: 14,
  },
  addButton: {
    minHeight: 48,
    minWidth: 84,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#264e36",
    paddingHorizontal: 18,
  },
  addButtonPressed: {
    backgroundColor: "#1b3826",
  },
  addButtonDisabled: {
    backgroundColor: "#92a08d",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  taskList: {
    gap: 10,
    paddingBottom: 32,
  },
  taskRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#dfe5d9",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 14,
  },
  taskRowPressed: {
    backgroundColor: "#eef3ea",
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6f7f69",
    borderRadius: 6,
  },
  checkboxDone: {
    borderColor: "#264e36",
    backgroundColor: "#264e36",
  },
  checkboxMark: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
  },
  taskTextGroup: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    color: "#171914",
    fontSize: 17,
    fontWeight: "700",
  },
  taskDone: {
    color: "#6f7f69",
    textDecorationLine: "line-through",
  },
  taskDate: {
    color: "#6f7f69",
    fontSize: 12,
  },
  centerState: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mutedText: {
    color: "#6f7f69",
    fontSize: 15,
  },
  errorText: {
    color: "#a43820",
    fontSize: 15,
    fontWeight: "600",
  },
});
